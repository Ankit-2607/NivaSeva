import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi, serviceApi } from '../services/api';
import {
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  IndianRupee,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  UserPlus,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import StatusBadge from '../components/Common/StatusBadge';
import Button from '../components/Common/Buttons';
import Input from '../components/Common/Input';
import Loader from '../components/Common/Loader';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'services' | 'admins'
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & message states
  const [bookingFilter, setBookingFilter] = useState('ALL');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Modal / Form States
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'Cleaning',
    price: '',
    duration: '60 mins',
    features: '',
  });

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, servicesRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAllBookings(),
        serviceApi.getAll({ all: 'true' }),
        adminApi.getAllUsers(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (servicesRes.success) setServices(servicesRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setFeedback({ type: 'error', text: err.message || 'Failed to fetch admin data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Booking Status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await adminApi.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setFeedback({ type: 'success', text: `Booking status updated to ${newStatus}` });
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
        // Refresh stats
        const statsRes = await adminApi.getStats();
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Status update failed.' });
    }
  };

  // Add Service Handler
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const res = await serviceApi.create(newService);
      if (res.success) {
        setFeedback({ type: 'success', text: 'New service added successfully!' });
        setShowAddServiceModal(false);
        setNewService({
          name: '',
          description: '',
          category: 'Cleaning',
          price: '',
          duration: '60 mins',
          features: '',
        });
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create service.' });
    }
  };

  // Delete Service Handler
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await serviceApi.delete(serviceId);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Service deleted successfully.' });
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete service.' });
    }
  };

  // Option 1: Create New Admin Handler
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createAdmin(newAdmin);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Admin account created successfully!' });
        setShowAddAdminModal(false);
        setNewAdmin({ name: '', email: '', password: '', phone: '' });
        loadData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create admin.' });
    }
  };

  const filteredBookings =
    bookingFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === bookingFilter);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <ShieldCheck size={14} /> Master Admin Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              HomeEase / NivaSeva Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Logged in as <strong className="text-white">{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddAdminModal(true)}
              className="border-slate-700 text-white hover:bg-slate-800 gap-1.5"
            >
              <UserPlus size={16} className="text-emerald-400" />
              + Add Admin (Option 1)
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddServiceModal(true)}
              className="gap-1.5"
            >
              <Plus size={16} />
              + Add Service
            </Button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback({ type: '', text: '' })}
              className="font-bold text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Bookings
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {stats?.totalBookings ?? bookings.length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Pending
            </span>
            <span className="text-2xl font-black text-amber-800 mt-1 block">
              {stats?.pendingBookings ?? 0}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Confirmed
            </span>
            <span className="text-2xl font-black text-blue-800 mt-1 block">
              {stats?.confirmedBookings ?? 0}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-2xl font-black text-emerald-800 mt-1 block">
              {stats?.completedBookings ?? 0}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Services
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {stats?.totalServices ?? services.length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              ₹{stats?.totalRevenue ?? 0}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar size={16} />
            Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'services'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={16} />
            Services Catalog ({services.length})
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'admins'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={16} />
            Team & Users ({usersList.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      bookingFilter === status
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            {loading ? (
              <Loader text="Loading bookings..." />
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500 text-sm">No bookings found for the selected status.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Booking Info</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">
                              {b.serviceName || b.service?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{b._id.slice(-6).toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {b.customer?.name || 'Customer'}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {b.customer?.phone || b.customer?.email}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-medium text-slate-800 block">
                              {new Date(b.scheduledDate).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-[11px] text-slate-500">{b.timeSlot}</span>
                          </td>

                          <td className="py-3.5 px-4 max-w-[200px] truncate" title={`${b.address.street}, ${b.address.city}`}>
                            <span>{b.address.street}, {b.address.city}</span>
                          </td>

                          <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                            ₹{b.priceSnapshot}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <StatusBadge status={b.status} />
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b._id, e.target.value)}
                              className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirm</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancel</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Active Catalog Services
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddServiceModal(true)}
                className="gap-1"
              >
                <Plus size={16} /> Add New Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {s.category}
                      </span>
                      <button
                        onClick={() => handleDeleteService(s._id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{s.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      Duration: {s.duration}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900">₹{s.price}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN & TEAM MANAGEMENT (Option 1!) */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            {/* Option 1 Explanation Callout */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={22} className="text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                    Option 1 Security Model: Trusted Admin Management
                  </h3>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    Under Option 1, public registration only creates Customer accounts. Admins are
                    created through a trusted backend seed script (initial admin Rahul) or by
                    existing authorized admins right here. Employees never choose their own roles.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                User Accounts ({usersList.length})
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddAdminModal(true)}
                className="gap-1.5"
              >
                <UserPlus size={16} />
                + Add Another Admin
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">User Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{u.phone || '—'}</td>
                        <td className="py-3 px-4">
                          <span className="text-emerald-600 font-semibold">
                            {u.accountStatus || 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add New Service */}
        {showAddServiceModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Add New Service</h3>
                <button
                  onClick={() => setShowAddServiceModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-4">
                <Input
                  label="Service Name"
                  id="srv_name"
                  required
                  placeholder="e.g. Sofa Shampoo & Steam Sanitization"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="block w-full rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-sm"
                    >
                      <option value="Cleaning">Cleaning</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Appliances">Appliances</option>
                      <option value="Painting">Painting</option>
                      <option value="Pest Control">Pest Control</option>
                    </select>
                  </div>

                  <Input
                    label="Price (₹)"
                    id="srv_price"
                    type="number"
                    required
                    placeholder="799"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Estimated Duration"
                    id="srv_duration"
                    placeholder="e.g. 60 mins"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />

                  <Input
                    label="Key Features (comma-separated)"
                    id="srv_features"
                    placeholder="Dry vacuuming, Shampoo wash"
                    value={newService.features}
                    onChange={(e) => setNewService({ ...newService, features: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed explanation of what the customer receives..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddServiceModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Create Service
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Option 1 Add Admin */}
        {showAddAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Add New Admin (Option 1)</h3>
                </div>
                <button
                  onClick={() => setShowAddAdminModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Assign administrative role directly to an employee (like Rahul). The role is enforced
                as ADMIN by the backend.
              </p>

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <Input
                  label="Admin Name"
                  id="admin_name"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />

                <Input
                  label="Email Address"
                  id="admin_email"
                  type="email"
                  required
                  placeholder="rahul@company.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />

                <Input
                  label="Initial Password"
                  id="admin_password"
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />

                <Input
                  label="Phone Number"
                  id="admin_phone"
                  placeholder="9876543210"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddAdminModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Create Admin Account
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
