import React, { useEffect, useState, ChangeEvent } from 'react';
import defaultProfile from '../../assets/defaults/default_profile.png';

export interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  theme?: 'system' | 'light' | 'dark';
}

interface SettingsProps {
  userProfile: UserProfile;
  onSaveProfile: (p: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onSaveProfile }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('light');

  useEffect(() => {
    setName(userProfile?.name || 'Burger Enthusiast');
    setEmail(userProfile?.email || 'you@bunsout.example');
    setPhone(userProfile?.phone || '');
    setAvatarUrl(userProfile?.avatarUrl || '');
    // If an older profile used 'system', normalize it to 'light' since we no longer support system.
    setTheme(userProfile?.theme === 'system' ? 'light' : userProfile?.theme || 'light');
  }, [userProfile]);

  const persistProfile = () => {
    const payload: UserProfile = { name, email, phone, avatarUrl, theme };
    onSaveProfile(payload);
    alert('Profile saved');
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFeedback = () => {
    const feedback = prompt('Send feedback (brief):');
    if (feedback && feedback.trim() !== '') {
      // store feedback locally for now
      const existing = JSON.parse(localStorage.getItem('app_feedback') || '[]');
      existing.push({ feedback, date: Date.now() });
      localStorage.setItem('app_feedback', JSON.stringify(existing));
      alert('Thanks for your feedback!');
    }
  };

  const handleDeleteAccount = () => {
    if (!confirm('This will clear saved profile and local data. Continue?')) return;
    localStorage.removeItem('user_profile');
    localStorage.removeItem('burger_orders');
    localStorage.removeItem('burger_menu');
    onSaveProfile({});
    alert('Account data cleared locally.');
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = defaultProfile; }} />
              ) : (
                <img src={defaultProfile} alt="Default Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <label className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm hover:bg-slate-100">
              Change profile picture
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>

            <button onClick={handleFeedback} className="mt-4 px-4 py-2 bg-white border border-slate-100 rounded-xl font-bold text-sm hover:bg-slate-50">
              Send Feedback
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Profile</h2>
            <p className="text-slate-500 mb-6">Manage your account information and preferences.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-3">Preferences</h3>
            <div className="space-y-4 mb-6">
              {/* Notifications setting removed */}

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold">Theme</p>
                  <p className="text-xs text-slate-400">Interface appearance</p>
                </div>
                <select value={theme} onChange={e => setTheme(e.target.value as any)} className="p-2 bg-white border rounded-lg font-bold">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={persistProfile} className="px-6 py-3 bg-orange-600 text-white font-black rounded-3xl hover:bg-orange-700">Save Changes</button>
              <button onClick={handleDeleteAccount} className="px-6 py-3 bg-white border border-red-200 text-red-500 font-black rounded-3xl hover:bg-red-50">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

