import React, { useState } from 'react';
import { User, ShieldCheck, Download, CheckCircle, Leaf, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExportData = async (format = 'json') => {
    setDownloading(true);
    try {
      const res = await api.get('/journal');
      if (res.data.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data.journals, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `EchoJournal_Export_${new Date().toISOString().slice(0,10)}.${format}`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setExported(true);
      }
    } catch (err) {
      alert('Failed to export data');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-sage-900">Profile & Security Settings</h1>
        <p className="text-sm text-sage-500">
          Manage your account preferences, AES-256 encryption status, and data export
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="card rounded-3xl p-6 sm:p-8 space-y-6 bg-white">
        <div className="flex items-center gap-4 pb-6 border-b border-sage-100">
          <div className="w-16 h-16 rounded-full bg-sage-gradient text-white flex items-center justify-center text-2xl font-serif font-bold shadow-nature-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-sage-800">{user?.name || 'User'}</h2>
            <p className="text-xs text-sage-400">{user?.email}</p>
            <span className="inline-block mt-2 badge-sage">Active Subscriber</span>
          </div>
        </div>

        {/* Encryption Audit Status */}
        <div className="space-y-4">
          <h3 className="text-base font-serif font-semibold text-sage-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sage-500" />
            Security & Encryption Audit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-1">
              <span className="text-[11px] font-bold text-sage-400 uppercase">Algorithm</span>
              <p className="text-sm font-bold text-sage-800">AES-256-CBC</p>
              <p className="text-[11px] text-sage-500">Military-grade symmetric encryption</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-1">
              <span className="text-[11px] font-bold text-sage-400 uppercase">Authentication</span>
              <p className="text-sm font-bold text-sage-800">JWT Bearer Token</p>
              <p className="text-[11px] text-sage-500">7-day secure session duration</p>
            </div>
          </div>
        </div>

        {/* Data Ownership & Export */}
        <div className="pt-6 border-t border-sage-100 space-y-4">
          <div>
            <h3 className="text-base font-serif font-semibold text-sage-800 flex items-center gap-2">
              <Download className="w-5 h-5 text-terra-500" />
              Data Portability & Backup
            </h3>
            <p className="text-xs text-sage-400 mt-1">
              Download your decrypted journal entries anytime for complete data ownership.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExportData('json')}
              disabled={downloading}
              className="btn-terra text-xs px-5 py-2.5"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Preparing Export...' : 'Download JSON Data'}
            </button>
          </div>

          {exported && (
            <div className="flex items-center gap-2 text-xs text-sage-600 font-medium pt-2">
              <CheckCircle className="w-4 h-4 text-sage-500" />
              Export downloaded successfully to your device!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
