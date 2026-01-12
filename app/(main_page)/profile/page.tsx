"use client";

import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface UserData {
    Id: number,
    UserName: string,
    FirstName: string,
    MiddleName: string,
    LastName: string,
    Email: string,
}

interface Password {
    User_Id: number,
    CurrentPassword: string,
    Password: string,
    ConfirmPassword: string
}

var user = JSON.parse(localStorage.getItem('user') || '{}');

const USER_INPUT: UserData = {
    Id: user.Id,
    UserName: user.UserName,
    FirstName: user.FirstName,
    MiddleName: user.MiddleName,
    LastName: user.LastName,
    Email: user.Email,
}

const PASSWORD_INPUT: Password = {
    User_Id: user.Id,
    CurrentPassword: "",
    Password: "",
    ConfirmPassword: ""
}


export default function ProfilePage() {
    const [profile, setProfile] = useState<UserData>(USER_INPUT);
    const [error, setError] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [password, setPassword] = useState(PASSWORD_INPUT);

    useEffect(() => {
        if (!loaded) {
            USER_INPUT;
        }
    }, [loaded])

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/routes/register/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Updating failed');
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.result.user));
            // user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log(data.result.user);

            toast.success('Profile updated successfully!');

            setLoaded(false);
            setIsEditing(false);
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordErr('');
        setLoading(true);

        try {
            const res = await fetch('/api/routes/register/change_password/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(password),
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordErr(data.message || 'Updating failed');
                return;
            }

            toast.success('Password changed successfully!');

            setLoaded(false);
            setShowPasswordForm(false);
            setPassword(PASSWORD_INPUT);
        } catch {
            setPasswordErr('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e: any, props: string) => {
        setProfile(profile => ({
            ...profile,
            [props]: e.target.value
        }));
    };

    const handlePasswordChange = (e: any, props: string) => {
        setPassword(prev => ({
            ...prev,
            [props]: e.target.value
        }));
    };

    const cancelEditProfile = () => {
        setIsEditing(false);
        setError('');
        setProfile(USER_INPUT);
    };

    const cancelEditPassword = () => {
        setShowPasswordForm(false);
        setPasswordErr('');
        setPassword(PASSWORD_INPUT);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-3xl space-y-6">

                {/* HEADER */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-600">
                        Manage your account information and security
                    </p>
                </div>

                {/* PROFILE INFO */}
                <div className="rounded-2xl bg-white p-6 shadow-md space-y-6">

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold text-white">
                            {profile.FirstName.charAt(0).toUpperCase() || ""}{profile.LastName.charAt(0).toUpperCase() || ""}
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                {profile.FirstName} {profile.LastName}
                            </p>
                            <p className="text-sm text-gray-500">{profile.Email}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* INPUTS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {[
                            ["Email", "Email"],
                            ["FirstName", "First Name"],
                            ["MiddleName", "Middle Name"],
                            ["LastName", "Last Name"],
                        ].map(([name, label]) => (
                            <div key={name} className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">
                                    {label}
                                </label>
                                <input
                                    name={name}
                                    value={(profile as any)[name]}
                                    onChange={(e) => handleProfileChange(e, name)}
                                    disabled={!isEditing}
                                    className={`rounded-lg border px-3 py-2 text-sm
                    ${!isEditing
                                            ? "bg-gray-100 cursor-not-allowed text-gray-600"
                                            : "bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-600"
                                        }`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={cancelEditProfile}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Security
                            </h2>
                            <p className="text-sm text-gray-600">
                                Protect your account
                            </p>
                        </div>

                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            Change Password
                        </button>
                    </div>

                    {showPasswordForm && (
                        <>
                            <div className="grid grid-cols-1 gap-4 pt-4">
                                {passwordErr && (
                                    <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                                        {passwordErr}
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="current"
                                        defaultValue={password.CurrentPassword}
                                        onChange={e => handlePasswordChange(e, "CurrentPassword")}
                                        className="rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-600"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="new"
                                        defaultValue={password.Password}
                                        onChange={e => handlePasswordChange(e, "Password")}
                                        className="rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-600"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-600">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm"
                                        defaultValue={password.ConfirmPassword}
                                        onChange={e => handlePasswordChange(e, "ConfirmPassword")}
                                        className="rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <button
                                    onClick={cancelEditPassword}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    Update Password
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
