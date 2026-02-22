import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Layout, Clock, Download, Trash2, Key, Smartphone } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          Configuration Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your preferences, API connections, and notification settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 border-r border-slate-200 dark:border-slate-800 pr-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left ${activeTab === 'profile' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'}`}>
              <User className="h-4 w-4" /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left ${activeTab === 'preferences' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'}`}>
              <SettingsIcon className="h-4 w-4" /> Application Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left ${activeTab === 'notifications' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'}`}>
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left ${activeTab === 'security' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'}`}>
              <Shield className="h-4 w-4" /> Security
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left ${activeTab === 'data' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/50'}`}>
              <Database className="h-4 w-4" /> Data Management
            </button>
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-8 animate-fade-in">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Details</h2>

              <div className="space-y-6">
                <div className="flex gap-6 items-center border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-10 w-10 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Full Name</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500" defaultValue="Alex Morgan" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Email Address</label>
                    <input type="email" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500" defaultValue="alex.morgan@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">Role / Title</label>
                    <input type="text" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500" defaultValue="VP of Engineering" />
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Application Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h3 className="text-slate-800 dark:text-slate-200 font-medium">Dark Mode</h3>
                    <p className="text-slate-500 text-sm">Force dark theme across the application</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h3 className="text-slate-800 dark:text-slate-200 font-medium">Default Analysis View</h3>
                    <p className="text-slate-500 text-sm">Choose the default tab when opening a report</p>
                  </div>
                  <select className="bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none">
                    <option>Executive Summary</option>
                    <option>Technical Details</option>
                    <option>Risk Assessment</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h3 className="text-slate-800 dark:text-slate-200 font-medium">Analysis Completed Alert</h3>
                    <p className="text-slate-500 text-sm">Receive email when AI finishes processing a large repo</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                  <div>
                    <h3 className="text-slate-800 dark:text-slate-200 font-medium">Critical Risk Detection</h3>
                    <p className="text-slate-500 text-sm">Immediate notification for high severity vulnerabilities</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex items-center justify-between bg-slate-50 dark:bg-[#0f172a]">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-lg"><Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                    <div>
                      <h3 className="text-slate-800 dark:text-slate-200 font-medium">Account Password</h3>
                      <p className="text-slate-500 text-sm">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 text-sm font-medium">Update</button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex items-center justify-between bg-slate-50 dark:bg-[#0f172a]">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-lg"><Smartphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                    <div>
                      <h3 className="text-slate-800 dark:text-slate-200 font-medium">Two-Factor Authentication</h3>
                      <p className="text-slate-500 text-sm">Currently disabled</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Data Management</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-slate-800 dark:text-slate-200 font-medium mb-2">Export Data</h3>
                  <p className="text-slate-500 text-sm mb-4">Download all your project analysis reports and configuration data in JSON format.</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors">
                    <Download className="w-4 h-4" /> Export All Data
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                  <p className="text-slate-500 text-sm mb-4">Permanently delete your account and all associated project data. This action cannot be undone.</p>
                  <button className="flex items-center gap-2 px-4 py-2 border border-red-500/50 hover:bg-red-500/10 text-red-500 rounded-lg text-sm transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
