import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviceApi } from '../services/api';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Search,
} from 'lucide-react';
import Button from '../components/Common/Buttons';
import Loader from '../components/Common/Loader';

// Helper to pick icon by service category / name
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

export const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceApi.getAll();
        if (res.success && res.data) {
          setServices(res.data);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} className="text-emerald-600" />
              India's Trusted Doorstep Home Services
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Expert Home Care,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Delivered in Minutes.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              From deep home cleaning and AC servicing to trusted plumbing and electrical repairs —
              book certified, background-verified professionals at transparent, upfront prices.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 max-w-xl mx-auto flex items-center gap-2 bg-white p-2 rounded-2xl shadow-lg shadow-emerald-950/5 border border-slate-200"
            >
              <div className="pl-3 text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for 'Deep Cleaning', 'AC Repair', 'Plumbing'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0 gap-1.5">
                Find Service
              </Button>
            </form>

            {/* Trust metrics */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>100% Background Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Transparent Upfront Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>4.8/5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES GRID */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Services Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Popular Services
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Selected by thousands of homeowners for quality and speed.
              </p>
            </div>
            <Link to="/services">
              <Button variant="outline" size="sm" className="gap-1 self-start">
                View All Services <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured services..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all duration-200 group"
                >
                  <div>
                    {/* Header: Icon & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        {getCategoryIcon(service.category)}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                        {service.features.slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">
                        Standard Rate
                      </span>
                      <span className="text-xl font-extrabold text-slate-900">
                        ₹{service.price}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">/ {service.duration}</span>
                    </div>
                    <Link to={`/book/${service._id}`}>
                      <Button variant="primary" size="sm" className="gap-1">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How NivaSeva Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Book professional home services in under 60 seconds with complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-600/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Service</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Choose from our range of verified services like cleaning, plumbing, or AC repair with
                transparent pricing.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-600/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Pick Date & Time</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Select your preferred date, convenient time slot, and enter your service address.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-slate-800/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Service Delivered</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                A certified professional arrives with all tools and completes the task with a 30-day
                service guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="py-14 bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to experience hassle-free home care?
          </h2>
          <p className="mt-3 text-sm text-emerald-100 max-w-xl mx-auto">
            Book now and get certified experts at your doorstep. Transparent rates, no hidden fees.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/services">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
              >
                Browse All Services
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
