import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
    <div className="w-16 h-16 rounded-3xl bg-sage-gradient text-white flex items-center justify-center shadow-nature-lg">
      <Leaf className="w-8 h-8 animate-sway" />
    </div>
    <div className="space-y-2">
      <h1 className="text-4xl font-serif font-bold text-sage-900">404 - Page Not Found</h1>
      <p className="text-sm text-sage-500 max-w-sm mx-auto">
        The journal page you are looking for has wandered into the forest or does not exist.
      </p>
    </div>
    <Link to="/dashboard" className="btn-primary text-xs px-6 py-3">
      <ArrowLeft className="w-4 h-4" /> Return to Safety
    </Link>
  </div>
);

export default NotFound;
