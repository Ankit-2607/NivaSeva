import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Clock, Award, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Trust Highlights Strip */}
      <div className="border-b border-slate-800 bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Verified Professionals</p>
              <p className="text-xs text-slate-400">Background checked and trained experts</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">On-Time Arrival</p>
              <p className="text-xs text-slate-400">Punctual service or reschedule for free</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Transparent Pricing</p>
              <p className="text-xs text-slate-400">Upfront quotes with no hidden charges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-lg font-black text-white">
              Niva<span className="text-emerald-400">Seva</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your trusted doorstep home service partner. We connect you with certified technicians for
            cleaning, plumbing, electrical, and appliance care.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-emerald-400" />
              <span>+91 7667029898</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-emerald-400" />
              <span>support@nivaseva.com</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            Popular Services
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/services" className="hover:text-emerald-400 transition-colors">
                Full Deep Home Cleaning
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-400 transition-colors">
                AC Jet Cleaning & Repair
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-400 transition-colors">
                Bathroom Deep Sanitization
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-400 transition-colors">
                Plumbing Pipe & Leakage Fix
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-400 transition-colors">
                Pest & Termite Control
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">
                About NivaSeva
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-400 transition-colors">
                Service Catalog
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-emerald-400 transition-colors">
                Partner / Admin Login
              </Link>
            </li>
            <li>
              <span className="text-slate-500">Terms of Service (Standard)</span>
            </li>
            <li>
              <span className="text-slate-500">Privacy Policy</span>
            </li>
          </ul>
        </div>

        {/* Admin / Demo access */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2.5">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Quick Demo Login
          </h4>
          <p className="text-xs text-slate-300">
            Easily test both roles with the seed credentials:
          </p>
          <div className="text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 font-mono text-slate-300 space-y-1">
            <p>
              <strong className="text-white">Admin:</strong> admin@nivaseva.com
            </p>
            <p className="text-slate-400">Pass: admin123</p>
            <div className="border-t border-slate-800 my-1" />
            <p>
              <strong className="text-white">Customer:</strong> customer@nivaseva.com
            </p>
            <p className="text-slate-400">Pass: customer123</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} NivaSeva Technologies. Built with React, Tailwind CSS, Express & MongoDB.</p>
      </div>
    </footer>
  );
};

export default Footer;
