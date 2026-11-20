import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import Input from '../components/Common/Input';
import Button from '../components/Common/Buttons';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/20 mb-3">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Customer Account
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Join NivaSeva to book trusted home services and track your appointments.
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              type="text"
              required
              placeholder="e.g. Priya Sharma"
              icon={User}
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              required
              placeholder="priya@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              id="phone"
              type="tel"
              placeholder="9876543210"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Password (min 6 characters)"
              id="password"
              type="password"
              required
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Security note explaining Option 1 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
              <ShieldAlert size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Security Policy (Option 1):</strong> Public registration is strictly for
                Customer accounts. Admin privileges are assigned only through the verified backend
                seed script or an existing Admin invitation.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Register Account <ArrowRight size={16} className="ml-1" />
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
