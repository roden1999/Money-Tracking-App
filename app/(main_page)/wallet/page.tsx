'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { MultiValue, SingleValue } from 'react-select';
import toast from 'react-hot-toast';

interface Wallet {
    Id: number,
    User_Id: number,
    Name: string,
    Description: string,
    Currency: string,
    Balance: number,
    TotalIncome: number,
    TotalExpense: number,
    Date: string
}

type WALLET_INPUT = {
    Id: number | null,
    User_Id: number | null,
    Name: string,
    Description: string,
    Currency: string,
    Balance: number,
    Date: string
}

const user = JSON.parse(localStorage.getItem("user") || "{}");

const initialWalletInput: WALLET_INPUT = {
    Id: null,
    User_Id: user.Id,
    Name: "",
    Description: "",
    Currency: "PHP",
    Balance: 0,
    Date: ""
};

export default function WalletPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [walletInput, setWalletInput] = useState(initialWalletInput);
    const [walletOptions, setWalletOptions] = useState<{ value: number; label: string }[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<MultiValue<{ value: number; label: string }>>([]);

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingWalletId, setEditingWalletId] = useState<number | null>(null);

    const [loaded, setLoaded] = useState(false);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    const currencyOptions = ['PHP', 'USD', 'EUR', 'GBP', 'JPY'];

    useEffect(() => {
        if (!loaded) {
            const fetchWalletData = async () => {
                setLoader(true);
                setError('');

                try {
                    const walletIds = selectedWallet.map((x) => x.value);

                    const res = await fetch('/api/routes/wallet/list/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ Ids: walletIds, User_Id: user.Id }),
                    });

                    if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.message || 'Failed to fetch wallet data');
                    }

                    const data = await res.json();
                    console.log(data.result);

                    setWallets(data.result instanceof Array ? data.result : [data.result]);

                    setLoaded(true);

                } catch (err: any) {
                    setError(err.message || 'Something went wrong');
                } finally {
                    setLoader(false);
                }
            };
            fetchWalletData();
        }
    }, [selectedWallet, loaded]);

    useEffect(() => {
        const fetchWallets = async () => {
            setLoader(true);
            setError('');
            try {
                const res = await fetch('/api/routes/wallet/options/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Id: user.Id })
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
    }, [loaded]);

    const handleAddWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);

        try {
            const res = await fetch('/api/routes/wallet/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(walletInput),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'adding failed');
                setLoader(false);
                return;
            }

            toast.success('Wallet added successfully!');
            setShowModal(false);
            setWalletInput(initialWalletInput);

            // Refresh list
            setLoaded(false);

        } catch {
            setError('Something went wrong');
        } finally {
            setLoader(false);
        }
    };

    const handleEditWallet = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoader(true);
        setError('');
        console.log(walletInput);
        try {
            const res = await fetch('/api/routes/wallet/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(walletInput),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Edit failed');
            }

            toast.success('Wallet updated successfully!');
            setShowEditModal(false);
            setLoaded(false);
            setWalletInput(initialWalletInput);

            // Refresh list
            setLoaded(false);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoader(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoader(true);
        setError('');

        try {
            const res = await fetch('/api/routes/wallet/', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(walletInput),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Delete failed');
            }

            // Refresh list
            setLoaded(false)

            toast.success('Wallet deleted successfully');
            setShowDeleteModal(false);
            setLoaded(false);
            setWalletInput(initialWalletInput);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoader(false);
        }
    };


    const closeModal = () => {
        setShowModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setWalletInput(initialWalletInput);
        setError('');
    }

    const openEditModal = (wallet: Wallet) => {
        setWalletInput(wallet);
        setShowEditModal(true);
    };

    const openDeleteModal = (wallet: Wallet) => {
        setWalletInput(wallet);
        setShowDeleteModal(true);
    };

    const handleInputChange = (e: any, prop: string) => {
        setWalletInput(prev => ({
            ...prev,
            [prop]: e.target.value
        }));
    }

    const handleSearchWallet = (e: MultiValue<{ value: number; label: string }>) => {
        setSelectedWallet(e);
        setLoaded(false);
    }

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
                                onChange={(e) => handleSearchWallet(e)}
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
                    {wallets?.length > 0 &&
                        wallets
                            .filter(w => w && w.Id) // ⛔ prevents ghost/undefined cards
                            .map((x) => {
                                const initial = Number(x.Balance ?? 0);
                                const income = Number(x.TotalIncome ?? 0);
                                const expense = Number(x.TotalExpense ?? 0);
                                const total = initial + income - expense;

                                return (
                                    <div
                                        key={x.Id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition"
                                    >
                                        {/* Header */}
                                        <div className="mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800 truncate">
                                                {x.Name || "Unnamed Wallet"}
                                            </h2>
                                            {x.Description && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {x.Description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Currency</span>
                                                <span className="font-medium text-gray-700">{x.Currency}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Initial Balance</span>
                                                <span className="font-semibold text-gray-800">
                                                    {x.Currency} {initial.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-green-600">
                                                <span>Income</span>
                                                <span className="font-medium">
                                                    {x.Currency} {income.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-red-500">
                                                <span>Expenses</span>
                                                <span className="font-medium">
                                                    {x.Currency} {expense.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* TOTAL */}
                                        <div className="mt-4 pt-4 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-600">
                                                    Total Balance
                                                </span>
                                                <span
                                                    className={`text-lg font-bold ${total >= 0 ? "text-green-700" : "text-red-600"
                                                        }`}
                                                >
                                                    {x.Currency} {total.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-5">
                                            <p className="text-xs text-gray-400 mb-3">
                                                Created: {x.Date ? new Date(x.Date).toLocaleDateString() : "-"}
                                            </p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(x)}
                                                    className="flex-1 bg-gray-700 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(x)}
                                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                    {/* Empty state */}
                    {wallets?.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center shadow-sm">

                            {/* Icon */}
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                                <svg
                                    className="h-7 w-7 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h8" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-800">
                                No wallets yet
                            </h3>

                            {/* Description */}
                            <p className="mt-1 max-w-md text-sm text-gray-500">
                                You haven’t created any wallets yet. Add your first wallet to start tracking
                                balances and transactions.
                            </p>
                        </div>
                    )}
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
                                defaultValue={walletInput.Name}
                                onChange={(e) => handleInputChange(e, "Name")}
                                required
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)"
                                defaultValue={walletInput.Description}
                                onChange={(e) => handleInputChange(e, "Description")}
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <select
                                defaultValue={walletInput.Currency}
                                onChange={(e) => handleInputChange(e, "Currency")}
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
                                defaultValue={walletInput.Balance}
                                onChange={(e) => handleInputChange(e, "Balance")}
                                required
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <input
                                type="date"
                                defaultValue={walletInput.Date}
                                onChange={(e) => handleInputChange(e, "Date")}
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
                                placeholder="Wallet Name"
                                defaultValue={walletInput.Name}
                                onChange={(e) => handleInputChange(e, "Name")}
                                required
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)"
                                defaultValue={walletInput.Description}
                                onChange={(e) => handleInputChange(e, "Description")}
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />
                            <select
                                defaultValue={walletInput.Currency}
                                onChange={(e) => handleInputChange(e, "Currency")}
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
                                defaultValue={walletInput.Balance}
                                onChange={(e) => handleInputChange(e, "Balance")}
                                required
                                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
                            />

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
                            Are you sure you want to delete this wallet?
                            <br />
                            <span className="text-red-500 font-medium">
                                This action cannot be undone.
                            </span>
                        </p>

                        {error && (
                            <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                disabled={loader}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
