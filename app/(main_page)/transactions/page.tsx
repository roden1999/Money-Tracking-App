'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { MultiValue, SingleValue } from 'react-select';
import toast from 'react-hot-toast';

interface Transaction {
  Id: number;
  Wallet_Id: number;
  Wallet: string;
  Amount: number;
  Type: 'Income' | 'Expense';
  Category: string;
  Description: string;
  Date: string;
}

const EXPENSE_CATEGORIES = [
  'Food',
  'Bills',
  'Rent',
  'Transportation',
  'Entertainment',
  'Shopping',
  'School',
  'Health',
  'Internet',
  'Utilities',
  'Others',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Allowance',
  'Business',
  'Freelance',
  'Bonus',
  'Gift',
  'Investment',
  'Others',
];


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletOptions, setWalletOptions] = useState<{ value: number; label: string }[]>([]);
  const [walletId, setWalletId] = useState<SingleValue<{ value: number; label: string }> | ''>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Income' | 'Expense' | ''>('');

  const typeOptions = ['Income', 'Expenses'];

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

  const fetchTransactions = async () => {
    setLoader(true);
    setError('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Validate dates
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      setError('To Date cannot be earlier than From Date.');
      setLoader(false);
      return;
    }

    try {
      const res = await fetch('/api/routes/transactions_view/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          User_Id: user.id,
          FromDate: fromDate || undefined,
          ToDate: toDate || undefined,
          Type: typeFilter || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      const data = await res.json();
      setTransactions(Array.isArray(data.result) ? data.result : []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fromDate, toDate, typeFilter]);

  const handleAddTransactions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
    try {
      const res = await fetch('/api/routes/transaction_add/', {
        method: 'POST',
        headers: { 'Content-Type': '  /json' },
        body: JSON.stringify({
          User_Id: user.id,
          Wallet_Id: walletId ? walletId.value : '',
          Amount: amount,
          Type: type,
          Description: description,
          Category: category,
          Date: date
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'adding failed');
        setLoader(false);
        return;
      }

      setShowModal(false);
      setWalletId('');
      setAmount('');
      setType('');
      setCategory('');
      setDescription('');
      setDate('');
      setError('');

      toast.success('Wallet added successfully!');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setWalletId('');
    setAmount('');
    setType('');
    setCategory('');
    setDescription('');
    setDate('');
    setError('');
  }

  const handleEdit = (tx: Transaction) => {
    toast('Edit clicked');
    console.log('Edit', tx);
  };

  const handleDelete = (tx: Transaction) => {
    toast.error('Delete clicked');
    console.log('Delete', tx);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 antialiased">
      <div className="p-6 max-w-6xl mx-auto bg-gray-50 text-gray-800 rounded-xl shadow-sm">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-600">Manage your transactions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            + Add Transaction
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
        </div>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        {/* TRANSACTIONS TABLE */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Wallet</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}

              {transactions.map((tx) => (
                <tr key={tx.Id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{tx.Wallet}</td>
                  <td className="p-3 text-gray-700">{new Date(tx.Date).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700">{tx.Category}</td>
                  <td className="p-3 text-gray-600">{tx.Description || '-'}</td>
                  <td
                    className={`p-3 text-right font-semibold ${tx.Type === 'Income' ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {tx.Type === 'Expense' ? '-' : '+'}
                    {tx.Amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(tx)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

            <form onSubmit={handleAddTransactions} className="flex flex-col gap-3">
              <div className="flex-1 min-w-[200px]">
                <Select
                  defaultValue={walletId}
                  options={walletOptions}
                  onChange={(e) => setWalletId(e)}
                  placeholder="Wallet"
                  isClearable
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
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              >
                {typeOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              >
                <option value="">Select Category</option>

                {(type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
    </div>
  );
}
