import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, CheckCircle2, HeartHandshake, Award } from 'lucide-react';
import Button from '../components/Common/Buttons';

export const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-emerald-600" />
            Our Mission & Story
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            About NivaSeva (HomeEase)
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            We are on a mission to simplify everyday life by bringing transparent, trustworthy, and
            top-quality home services straight to your doorstep.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 mb-10 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Why We Built NivaSeva</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Finding dependable help for deep cleaning, plumbing leakages, electrical short-circuits,
            or appliance servicing is often frustrating. Homeowners face unreliable arrival times,
            opaque price quotes, and unverified workers.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            NivaSeva bridges this trust gap. We vet, background-verify, and standardize training for
            every professional on our platform, while guaranteeing fixed upfront pricing so you
            never have to haggle.
          </p>
        </div>

        {/* Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Background Verified</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Every technician is police-verified and certified with practical trade assessments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">30-Day Service Guarantee</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Not fully satisfied? We provide a complimentary re-visit with zero questions asked.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Empowering Service Pros</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              We ensure our service partners receive fair wages, safety training, and reliable work.
            </p>
          </div>
        </div>

        {/* Quick CTA */}
        <div className="text-center bg-slate-900 text-white rounded-2xl p-8 sm:p-10">
          <h3 className="text-xl font-bold">Experience the NivaSeva Standard</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Book your first service in seconds and enjoy reliable home care.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/services">
              <Button variant="primary" size="md">
                Browse All Services
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="md" className="border-slate-700 text-white hover:bg-slate-800">
                Join As Customer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
