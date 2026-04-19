import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/api/auth-service';
import { useAuthStore } from '../../store/auth-store';
import { FlowbitLogo } from '../../components/icons/Logo';
import { Button } from '../../components/common/Button';
import { Loader2, ArrowLeft, LogOut } from 'lucide-react';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuthStore();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!user);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await AuthService.getCurrentProfile();
                updateUser(profile);
                setName(profile.name);
                setEmail(profile.email);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) {
            fetchProfile();
        }
    }, [isLoading, updateUser]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsSaving(true);
        try {
            const updatedProfile = await AuthService.updateProfile(name);
            updateUser(updatedProfile);
            setMessage({ text: 'Profile updated successfully', type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.response?.data?.message || 'Failed to update profile', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <header className="h-20 px-10 flex items-center border-b border-slate-800/50 justify-between bg-slate-900/40">
                <div className="flex items-center gap-4">
                    <Link to="/space" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <FlowbitLogo className="w-6 h-6" />
                        <span className="text-xl font-bold tracking-tight">Settings</span>
                    </div>
                </div>
                <Button variant="danger" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </header>

            <main className="max-w-3xl mx-auto py-10 px-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl shadow-black/20">
                    <div className="px-8 py-6 border-b border-slate-800/50 bg-slate-900/80">
                        <h2 className="text-xl font-semibold">User Profile</h2>
                        <p className="text-sm text-slate-400 mt-1">Update your personal information</p>
                    </div>

                    <div className="px-8 py-6">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        type="email"
                                        disabled
                                        value={email}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-800 rounded-lg shadow-sm sm:text-sm bg-slate-950/50 text-slate-500 cursor-not-allowed"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">Your email address cannot be changed.</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3 border border-slate-700 rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-950 text-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" variant="primary" disabled={isSaving || !name.trim()}>
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
