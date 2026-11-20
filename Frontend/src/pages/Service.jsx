import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { serviceApi } from '../services/api';
import {
  Sparkles,
  Wrench,
  Zap,
  Wind,
  Droplets,
  ShieldCheck,
  Search,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Button from '../components/Common/Buttons';
import Loader from '../components/Common/Loader';

const categories = ['All', 'Cleaning', 'Plumbing', 'Electrical', 'Appliances', 'Pest Control'];

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'cleaning':
      return <Sparkles className="text-emerald-600" size={24} />;
    case 'plumbing':
      return <Wrench className="text-blue-600" size={24} />;
    case 'electrical':
      return <Zap className="text-amber-500" size={24} />;
    case 'appliances':
      return <Wind className="text-cyan-600" size={24} />;
    default:
      return <ShieldCheck className="text-emerald-600" size={24} />;
  }
};

export const Service = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAll({
        category: selectedCategory,
        search: searchQuery,
      });
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Verified Professionals
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            Our Home Services
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Explore trusted services backed by our 100% satisfaction and upfront pricing guarantee.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. cleaning, ac, tap fix)..."
                className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </form>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <Loader text="Fetching available services..." />
        ) : services.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No services found</h3>
            <p className="text-xs text-slate-500 mt-1">
              We couldn't find any services matching your search or category filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                      {getCategoryIcon(service.category)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 font-medium">
                    <Clock size={14} className="text-slate-400" />
                    <span>Estimated time: {service.duration}</span>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        What's Included:
                      </p>
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase font-medium">
                      Standard Rate
                    </span>
                    <span className="text-xl font-black text-slate-900">₹{service.price}</span>
                  </div>
                  <Link to={`/book/${service._id}`}>
                    <Button variant="primary" size="sm">
                      Book Service
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Service;
