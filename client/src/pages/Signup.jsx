import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await signup(name, email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Signup failed');
      }
    } catch (err) {
      setError('Error connecting to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="card rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-nature-xl bg-white space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sage-gradient text-white flex items-center justify-center mx-auto shadow-nature-md">
            <Leaf className="w-6 h-6 animate-sway" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-sage-900">Begin Your Wellness Journey</h1>
          <p className="text-xs text-sage-400">Create your zero-knowledge encrypted account</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-terra-50 border border-terra-100 text-terra-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="section-label">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-sage-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-nature pl-11 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="section-label">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sage-400 absolute left-4 top-3.5" />
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-nature pl-11 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="section-label">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sage-400 absolute left-4 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-nature pl-11 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs rounded-2xl mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-sage-100 text-center space-y-3">
          <p className="text-xs text-sage-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sage-700 hover:underline">
              Log in here
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-sage-400">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
            <span>Protected with AES-256 military encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
