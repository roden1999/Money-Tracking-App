'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  UserName: string,
  Password: string
}

const USER_DATA = {
  UserName: "",
  Password: ""
}

export default function LoginPage() {
  const router = useRouter();
  const [userCredentials, setUserCredentials] = useState<User>(USER_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/routes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCredentials),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid username or password');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.replace('/dashboard');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeInput = (e: any, props: string) => {
      setUserCredentials(prev => ({
        ...prev,
        [props]: e.target.value
      }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black antialiased">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-xl" />

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
            Sign in
          </h1>

          <p className="text-sm text-gray-600 text-center mb-6">
            Whats up let's save some money 👋
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Username
            </label>
            <input
              type="text"
              defaultValue={userCredentials.UserName}
              onChange={(e) => handleChangeInput(e, "UserName")}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              defaultValue={userCredentials.Password}
              onChange={(e) => handleChangeInput(e, "Password")}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold tracking-wide hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-6 text-sm text-center text-gray-700">
            Don't have account?{' '}
            <span
              onClick={() => router.push('/register')}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Create account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
