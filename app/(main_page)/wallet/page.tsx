'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { MultiValue, SingleValue } from 'react-select';
import toast from 'react-hot-toast';

interface Wallet {
    Id: number,
    Name: string,
    Description: string,
    Currency: string,
    Balance: number,
    Date: Date
}

export default function WalletPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [walletOptions, setWalletOptions] = useState<{ value: number; label: string }[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<MultiValue<{ value: number; label: string }>>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('₱');
    const [balance, setBalance] = useState<number | ''>('');
    const [dateValue, setDateValue] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingWalletId, setEditingWalletId] = useState<number | null>(null);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    const currencyOptions = ['₱', '$', '€', '£', '¥'];

    useEffect(() => {
        const fetchWalletData = async () => {
            setLoader(true);
            setError('');

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            try {
                const walletIds = selectedWallet.map((x) => x.value);

                const res = await fetch('/api/routes/wallet_view/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Ids: walletIds, User_Id: user.id }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to fetch wallet data');
                }

                const data = await res.json();

                setWallets(data.result instanceof Array ? data.result : [data.result]);

            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoader(false);
            }
        };

        fetchWalletData();
    }, [selectedWallet]);

    useEffect(() => {
        const fetchWallets = async () => {
            setLoader(true);
            setError('');
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const res = await fetch('/api/routes/wallet_options', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Id: user.id })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to fetch wallets');
                }

                const data = await res.json();

                const options = data.result.map((x: any) => ({
                    value: x.Id,
                    label: x.Name,
                }));

                setWalletOptions(options);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoader(false);
            }
        };

        fetchWallets();
    }, []);

    const handleAddWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log(user);
        try {
            const res = await fetch('/api/routes/wallet_add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    User_Id: user.id,
                    Name: name,
                    Description: description,
                    Currency: currency,
                    Balance: balance,
                    Date: dateValue,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'adding failed');
                setLoader(false);
                return;
            }

            setShowModal(false);
            setName('');
            setCurrency('₱');
            setBalance('');
            setDateValue('');
            setError('');

            toast.success('Wallet added successfully!');
        } catch {
            setError('Something went wrong');
        } finally {
            setLoader(false);
        }
    };

    const handleEditWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWalletId) return;

        setLoader(true);
        setError('');

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const res = await fetch('/api/routes/wallet_edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Id: editingWalletId,
                    User_Id: user.id,
                    Name: name,
                    Description: description,
                    Currency: currency,
                    Balance: balance,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Edit failed');
            }

            toast.success('Wallet updated successfully!');
            setShowEditModal(false);

            // Refresh list
            setSelectedWallet([...selectedWallet]);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoader(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!editingWalletId) return;

        setLoader(true);
        setError('');

        try {
            const res = await fetch('/api/routes/wallet_delete/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Id: editingWalletId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Delete failed');
            }

            // Remove from UI immediately
            setWallets((prev) => prev.filter(w => w.Id !== editingWalletId));

            toast.success('Wallet deleted successfully');
            setShowDeleteModal(false);
            setEditingWalletId(null);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoader(false);
        }
    };

    const openDeleteModal = (id: number) => {
        setEditingWalletId(id);
        setShowDeleteModal(true);
    };


    const closeModal = () => {
        setShowModal(false);
        setName('');
        setCurrency('₱');
        setBalance('');
        setDateValue('');
        setError('');
    }

    const openEditModal = (wallet: Wallet) => {
        setEditingWalletId(wallet.Id);
        setName(wallet.Name);
        setDescription(wallet.Description);
        setCurrency(wallet.Currency);
        setBalance(wallet.Balance);
        setShowEditModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 antialiased">
            <div className="mx-auto max-w-7xl space-y-6 bg-gray-50 p-6">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 antialiased">
                            My Wallets
                        </h1>
                        <p className="text-sm text-gray-600 antialiased">
                            Manage and track your wallets
                        </p>
                    </div>

                    {/* Right-side controls */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex-1 min-w-[200px]">
                            <Select
                                defaultValue={selectedWallet}
                                options={walletOptions}
                                onChange={(e) => setSelectedWallet(e)}
                                placeholder="Search..."
                                isClearable
                                isMulti
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: '#D1D5DB', // Tailwind gray-300
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none',
                                        backgroundColor: '#FFFFFF',
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        color: '#111827', // Tailwind gray-900
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: '#111827',
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: '#111827',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#9CA3AF', // Tailwind gray-400
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        color: '#111827',
                                        backgroundColor: state.isFocused
                                            ? '#F3F4F6' // Tailwind gray-100
                                            : state.isSelected
                                                ? '#E5E7EB' // Tailwind gray-200
                                                : '#FFFFFF',
                                        cursor: 'pointer',
                                    }),
                                }}
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                        >
                            + Add Wallet
                        </button>
                    </div>
                </div>

                {/* WALLET CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wallets.map((wallet) => (
                        <div
                            key={wallet.Id}
                            className="bg-white rounded-xl shadow p-6 flex flex-col justify-between antialiased"
                        >
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-gray-700">{wallet.Name}</h2>
                                <p className="text-gray-500 mb-1">Description: {wallet.Description}</p>
                                <p className="text-gray-500 mb-1">Currency: {wallet.Currency}</p>
                                <p className="text-gray-700 font-medium mb-2">
                                    Balance: {wallet.Currency} {wallet.Balance.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-400">{wallet.Date.toString()}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => openEditModal(wallet)}
                                    className="flex-1 bg-gray-600 text-white py-1 rounded-lg hover:bg-gray-700 transition">
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteModal(wallet.Id)}
                                    className="flex-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 antialiased text-gray-900">
                            Add Wallet
                        </h2>

                        {/* error nga ni */}
                        {error && (
                            <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddWallet} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Wallet Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            >
                                {currencyOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Balance"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                required
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <input
                                type="date"
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />

                            {/* BUTTONS ROW */}
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loader}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add Wallet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/*Edit modal*/}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">
                            Edit Wallet
                        </h2>

                        {error && (
                            <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEditWallet} className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border px-3 py-2 rounded-lg text-gray-900"
                            />

                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border px-3 py-2 rounded-lg text-gray-900"
                            />

                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="border px-3 py-2 rounded-lg text-gray-900"
                            >
                                {currencyOptions.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                required
                                className="border px-3 py-2 rounded-lg text-gray-900"
                            />

                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loader}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Update Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/*Delete modal*/}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Wallet
                        </h2>

                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this wallet my homie?
                            <br />
                            <span className="text-red-500 font-medium">
                                This action cannot be undone yah.
                            </span>
                        </p>

                        {error && (
                            <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setEditingWalletId(null);
                                }}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                disabled={loader}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
