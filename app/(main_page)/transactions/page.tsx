'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { MultiValue, SingleValue } from 'react-select';
import toast from 'react-hot-toast';

interface Transaction {
  Id: number | null;
  Wallet_Id: number | null;
  User_Id: number | null;
  Wallet: string;
  Amount: number;
  Type: 'Income' | 'Expense';
  Category: string;
  Description: string;
  Date: string;
}

interface Search {
  Wallet_Ids: number[] | null;
  From_Date: string;
  To_Date: string;
  Type: string;
}

const TRANSACTION_INPUT: Transaction = {
  Id: null,
  Wallet_Id: null,
  User_Id: null,
  Wallet: "",
  Amount: 0,
  Type: 'Income',
  Category: "",
  Description: "",
  Date: ""
}

const SEARCH_DATA: Search = {
  Wallet_Ids: [],
  From_Date: "",
  To_Date: "",
  Type: "",
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

type WalletOption = {
  value: number;
  label: string;
};


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transacInput, setTransacInput] = useState<Transaction>(TRANSACTION_INPUT);
  const [walletOptions, setWalletOptions] = useState<{ value: number; label: string }[]>([]);
  const [walletSelectInput, setWalletSelectInput] = useState<SingleValue<WalletOption>>();
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [loader, setLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filters
  const [searchInput, setSearchInput] = useState<Search>(SEARCH_DATA);
  const [selectedWallets, setSelectedWallet] = useState<MultiValue<{ value: number; label: string }>>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Income' | 'Expense' | ''>('');

  const typeOptions = ['Income', 'Expenses'];

  useEffect(() => {
    if (!loaded) {
      fetchTransactions();
      fetchWallets();
    }
  }, [loaded, selectedWallets, fromDate, toDate, typeFilter]);

  const fetchWallets = async () => {
    setLoader(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch('/api/routes/wallet/options/', {
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
      setLoaded(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const fetchTransactions = async () => {
    setLoader(true);
    setError('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Validate dates
    if (searchInput.From_Date && searchInput.To_Date && new Date(searchInput.From_Date) < new Date(searchInput.To_Date)) {
      setError('To Date cannot be earlier than From Date.');
      setLoader(false);
      return;
    }

    try {
      const res = await fetch('/api/routes/transactions/list/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchInput),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      const data = await res.json();
      console.log(data);
      setTransactions(Array.isArray(data.result) ? data.result : []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const handleAddTransactions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setTransacInput(prev => ({
      ...prev,
      ["User_Id"]: user.id
    }));
    console.log(user);
    try {
      const res = await fetch('/api/routes/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transacInput),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'adding failed');
        setLoader(false);
        return;
      }

      setTransactions([...transactions]);

      toast.success('Transaction added successfully!');
      setShowModal(false);
      setTransacInput(TRANSACTION_INPUT);
      setError('');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const handleEditTransactions = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoader(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setTransacInput(prev => ({
      ...prev,
      ["User_Id"]: user.id
    }));
    try {
      const res = await fetch('/api/routes/transactions/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transacInput),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'adding failed');
        setLoader(false);
        return;
      }

      toast.success('Transaction updated successfully!');
      setShowEditModal(false);
      setTransacInput(TRANSACTION_INPUT);
      setError('');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteTransactions = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoader(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setTransacInput(prev => ({
      ...prev,
      ["User_Id"]: user.id
    }));
    try {
      const res = await fetch('/api/routes/transactions/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transacInput),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'adding failed');
        setLoader(false);
        return;
      }

      toast.success('Transaction added successfully!');
      setShowDeleteModal(false);
      setTransacInput(TRANSACTION_INPUT);
      setError('');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setTransacInput(TRANSACTION_INPUT);
    setError('');
  }

  const handleEdit = (tx: Transaction) => {
    setShowEditModal(true);
    setTransacInput(tx);
    console.log('Edit', tx);
  };

  const handleDelete = (tx: Transaction) => {
    setShowDeleteModal(true);
    setTransacInput(tx);
    console.log('Delete', tx);
  };

  const handleInputChange = (e: any, prop: string) => {
    setTransacInput(prev => ({
      ...prev,
      [prop]: e.target.value
    }));
  }

  const handleSelectChange = (e: SingleValue<WalletOption>) => {
    setWalletSelectInput(e);

    if (!e) return;
    setTransacInput(prev => ({
      ...prev,
      ["Wallet_Id"]: e.value,
      ["Wallet"]: e.label
    }));

    console.log(transacInput.Wallet_Id);
  }

  const handleSearchInputChange = (e: any, prop: string) => {
    setSearchInput(prev => ({
      ...prev,
      [prop]: e.target.value
    }));
    setLoaded(false);
  }

  const handleSearchWallet = (e: MultiValue<{ value: number; label: string }>) => {
    setSelectedWallet(e);
    const walletIds = selectedWallets.map((x) => x.value);
    setSearchInput(prev => ({
      ...prev,
      ["Wallet_Ids"]: walletIds
    }));
    setLoaded(false);
  }

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
          <div className="w-full max-w-[220px]">
            <label className="block text-gray-700 text-sm mb-1">Wallets</label>
            <Select
              defaultValue={selectedWallets}
              options={walletOptions}
              onChange={(e) => handleSearchWallet(e)}
              placeholder="Search..."
              isClearable
              isMulti
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#D1D5DB',
                  borderRadius: '0.5rem',
                  boxShadow: 'none',
                  backgroundColor: '#FFFFFF',
                  minHeight: '44px',
                }),

                valueContainer: (base) => ({
                  ...base,
                  maxHeight: '38px',        // prevents expansion
                  overflowX: 'auto',        // enables scrolling
                  overflowY: 'hidden',        // enables scrolling
                  flexWrap: 'nowrap',       // prevents wrapping
                }),

                multiValue: (base) => ({
                  ...base,
                  flexShrink: 0,            // keeps items inline
                }),

                input: (base) => ({
                  ...base,
                  color: '#111827',
                }),

                placeholder: (base) => ({
                  ...base,
                  color: '#9CA3AF',
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
                    ? '#F3F4F6'
                    : state.isSelected
                      ? '#E5E7EB'
                      : '#FFFFFF',
                  cursor: 'pointer',
                }),
              }}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">From Date</label>
            <input
              type="date"
              defaultValue={searchInput.From_Date}
              onChange={(e) => handleSearchInputChange(e, "From_Date")}
              className="border border-gray rounded-md px-3 py-2 w-full focus:border-gray-300 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">To Date</label>
            <input
              type="date"
              defaultValue={searchInput.To_Date}
              onChange={(e) => handleSearchInputChange(e, "To_Date")}
              className="border border-gray rounded-md px-3 py-2 w-full focus:border-gray-300 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1">Type</label>
            <select
              defaultValue={searchInput.Type}
              onChange={(e) => handleSearchInputChange(e, "Type")}
              className="border border-gray rounded-md px-3 py-2 w-full focus:border-gray-300 focus:ring-0"
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
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left border-r border-gray-300">Wallet</th>
                <th className="p-3 text-left border-r border-gray-300">Date</th>
                <th className="p-3 text-left border-r border-gray-300">Category</th>
                <th className="p-3 text-left border-r border-gray-300">Description</th>
                <th className="p-3 text-right border-r border-gray-300">Amount</th>
                <th className="p-3 text-center border-r border-gray-300">Actions</th>
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
                  <td className="p-3 font-medium text-gray-800 border-r border-gray-300">{tx.Wallet}</td>
                  <td className="p-3 text-gray-700 border-r border-gray-300">{new Date(tx.Date).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-700 border-r border-gray-300">{tx.Category}</td>
                  <td className="p-3 text-gray-600 border-r border-gray-300">{tx.Description || '-'}</td>
                  <td
                    className={`p-3 text-right font-semibold border-r border-gray-300 ${tx.Type === 'Income' ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {tx.Type === 'Expense' ? '-' : '+'}
                    {tx.Amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-center space-x-2 border-r border-gray-300">
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
                  defaultValue={walletSelectInput}
                  options={walletOptions}
                  onChange={(e) => handleSelectChange(e)}
                  placeholder="Wallet"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#062452ff', // Tailwind gray-300
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
                defaultValue={transacInput.Amount}
                onChange={(e) => handleInputChange(e, "Amount")}
                required
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                defaultValue={transacInput.Description}
                onChange={(e) => handleInputChange(e, "Description")}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              />
              <select
                defaultValue={transacInput.Type}
                onChange={(e) => handleInputChange(e, "Type")}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              >
                {typeOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                defaultValue={transacInput.Category}
                onChange={(e) => handleInputChange(e, "Category")}
                required
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              >
                <option value="">Select Category</option>

                {(transacInput.Type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                defaultValue={transacInput.Date}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 antialiased text-gray-900">
              Update Wallet
            </h2>

            {/* error nga ni */}
            {error && (
              <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleEditTransactions} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="Amount"
                defaultValue={transacInput.Amount}
                onChange={(e) => handleInputChange(e, "Amount")}
                required
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                defaultValue={transacInput.Description}
                onChange={(e) => handleInputChange(e, "Description")}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              />
              <select
                defaultValue={transacInput.Type}
                onChange={(e) => handleInputChange(e, "Type")}
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              >
                {typeOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                defaultValue={transacInput.Category}
                onChange={(e) => handleInputChange(e, "Category")}
                required
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 antialiased"
              >
                <option value="">Select Category</option>

                {(transacInput.Type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                defaultValue={transacInput.Date}
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 antialiased text-gray-900">
              Delete Transaction
            </h2>

            {/* Warning Message */}
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              ⚠️ Are you sure you want to delete this transaction? This action cannot be undone.
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTransactions}
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
