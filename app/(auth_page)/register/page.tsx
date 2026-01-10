'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [UserName, setUserName] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [MiddleName, setMiddleName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/routes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName,
          FirstName,
          MiddleName,
          LastName,
          Email,
          Password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      router.replace('/login');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black antialiased">
      <div className="relative w-full max-w-lg">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-xl" />

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
            Create Account
          </h1>

          <p className="text-sm text-gray-600 text-center mb-6">
            Register to login 🚀
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Grid for names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="input"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="input"
            />
          </div>

          <input
            type="text"
            placeholder="Middle Name (optional)"
            value={MiddleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="input mb-4"
          />

          <input
            type="text"
            placeholder="Username"
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="input mb-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold tracking-wide hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <p className="mt-6 text-sm text-center text-gray-700">
            Already have account?{' '}
            <span
              onClick={() => router.push('/login')}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>

      {/* Tailwind reusable input style */}
      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          color: #111827;
          font-size: 0.95rem;
        }
        .input::placeholder {
          color: #9ca3af;
        }
        .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
