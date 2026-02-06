import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Lock, LogOut } from 'lucide-react';
import './Settings.css';


const Settings = () => {
    const { user, updateName, updatePassword, logout } = useAuth();
    const navigate = useNavigate();

    // Name State
    const [newName, setNewName] = useState(user?.name || '');
    const [nameStatus, setNameStatus] = useState({ type: '', msg: '' });

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passStatus, setPassStatus] = useState({ type: '', msg: '' });

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setNameStatus({ type: '', msg: '' });

        const result = await updateName(newName);
        if (result.success) {
            setNameStatus({ type: 'success', msg: 'Name updated successfully!' });
        } else {
            setNameStatus({ type: 'error', msg: result.error });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPassStatus({ type: '', msg: '' });

        if (newPass !== confirmPass) {
            setPassStatus({ type: 'error', msg: "New passwords don't match" });
            return;
        }

        const result = await updatePassword(oldPassword, newPass);
        if (result.success) {
            setPassStatus({ type: 'success', msg: 'Password updated successfully!' });
            setOldPassword('');
            setNewPass('');
            setConfirmPass('');
        } else {
            setPassStatus({ type: 'error', msg: result.error });
        }
    };

    const handleSignOut = async () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            await logout();
            navigate('/login');
        }
    };

    return (

        <div className="settings-container">
            <div className="settings-card">
                <div className="settings-header">
                    <h1>Account Settings</h1>
                    <button onClick={() => navigate('/creativity/home')} className="back-btn">
                        <ArrowLeft size={18} /> Back to Design
                    </button>
                </div>

                {/* Personal Information */}
                <div className="settings-section">
                    <h2><User size={18} /> Personal Information</h2>
                    <form onSubmit={handleUpdateName}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="settings-input"
                                placeholder="Your display name"
                            />
                        </div>

                        {nameStatus.msg && (
                            <div className={`status-msg ${nameStatus.type}`}>
                                {nameStatus.msg}
                            </div>
                        )}

                        <button type="submit" className="save-btn">
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* Password Security */}
                <div className="settings-section">
                    <h2><Lock size={18} /> Security</h2>
                    <form onSubmit={handleUpdatePassword}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="settings-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className="settings-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="settings-input"
                                required
                            />
                        </div>

                        {passStatus.msg && (
                            <div className={`status-msg ${passStatus.type}`}>
                                {passStatus.msg}
                            </div>
                        )}

                        <button type="submit" className="save-btn">
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="logout-section">
                    <button onClick={handleSignOut} className="logout-btn">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
