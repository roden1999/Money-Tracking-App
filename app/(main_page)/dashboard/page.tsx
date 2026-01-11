'use client';
import { useEffect, useState, useMemo } from 'react';

//components
import CurrencyConverter from '../../components/currency_chart';
import CurrencyPieChart from '../../components/total_piechart';

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

type CurrencyCode = 'PHP' | 'USD' | 'EUR' | 'JPY' | 'GBP';

const TOTALS: Record<CurrencyCode, number> = {
  PHP: 0,
  USD: 0,
  EUR: 0,
  JPY: 0,
  GBP: 0,
};


export default function DashboardPage() {
  const [walletData, setWalletData] = useState<Wallet[]>([]);
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [currencyTotals, setCurrencyTotals] = useState<Record<CurrencyCode, number>>(TOTALS);

  const [loaded, setLoaded] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loaded) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [loaded]);

  useEffect(() => {
    const totals: Record<string, number> = {};
    walletData.forEach(wallet => {
      const currency = String(wallet.Currency ?? 'PHP').toUpperCase().trim();
      const balance =
        Number(wallet.Balance ?? 0) -
        Number(wallet.TotalExpense ?? 0) +
        Number(wallet.TotalIncome ?? 0);

      totals[currency] = (totals[currency] ?? 0) + balance;
    });
    setCurrencyTotals(totals);
  }, [walletData]);

  const fetchWalletData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setLoader(true);
    setError('');

    try {

      const res = await fetch('/api/routes/wallet/list/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ User_Id: user.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch wallet data');
      }

      const data = await res.json();

      setWalletData(data.result instanceof Array ? data.result : [data.result]);

      setLoaded(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const fetchTransactions = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setLoader(true);
    setError('');

    try {
      const res = await fetch('/api/routes/transactions/list/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ User_Id: user.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      const data = await res.json();
      setTransactionData(Array.isArray(data.result) ? data.result : []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
    }
  };


  // TEMP mock data (replace with API later)
  const transactions = [
    { id: 1, title: 'Groceries', amount: -450, date: '2025-01-10' },
    { id: 2, title: 'Salary', amount: 25000, date: '2025-01-05' },
    { id: 3, title: 'Coffee', amount: -120, date: '2025-01-03' },
  ];

  const totalBalance = walletData.reduce((sum, w) => sum + w.Balance, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your finances</p>
        </div>

        {/* TOTAL MONEY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">

          {/* PHP */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Balance (PHP)</p>
            <h2 className="mt-2 text-4xl font-bold">
              ₱ {currencyTotals.PHP?.toLocaleString() || 0}
            </h2>
          </div>

          {/* USD */}
          <div className="rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Balance (USD)</p>
            <h2 className="mt-2 text-4xl font-bold">
              $ {currencyTotals.USD?.toLocaleString() || 0}
            </h2>
          </div>

          {/* EUR */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Balance (EUR)</p>
            <h2 className="mt-2 text-4xl font-bold">
              € {currencyTotals.EUR?.toLocaleString() || 0}
            </h2>
          </div>

          {/* JPY */}
          <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Balance (JPY)</p>
            <h2 className="mt-2 text-4xl font-bold">
              ¥ {currencyTotals.JPY?.toLocaleString() || 0}
            </h2>
          </div>

          {/* GBP */}
          <div className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white shadow-lg">
            <p className="text-sm opacity-80">Total Balance (GBP)</p>
            <h2 className="mt-2 text-4xl font-bold">
              £ {currencyTotals.GBP?.toLocaleString() || 0}
            </h2>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* WALLETS */}
          <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow flex flex-col" style={{ height: '380px' }}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">My Wallets</h3>
            <ul className="space-y-4 flex-1 overflow-auto">
              {loader ? (
                <li className="flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-500 text-sm">Loading wallets...</p>
                </li>
              ) : walletData?.length === 0 ? (
                <li className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">

                  {/* Icon */}
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
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
                  <p className="text-sm font-semibold text-gray-800">
                    No wallets yet
                  </p>

                  {/* Description */}
                  <p className="mt-1 text-xs text-gray-500 max-w-[200px]">
                    Create a wallet to start tracking your balances and transactions
                  </p>
                </li>
              ) : (
                walletData.map(x => (
                  <li
                    key={x.Id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">{x.Name}</span>
                    <span className="font-semibold text-gray-900">
                      {x.Currency}{' '}
                      {(
                        Number(x.Balance ?? 0) -
                        Number(x.TotalExpense ?? 0) +
                        Number(x.TotalIncome ?? 0)
                      ).toLocaleString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>


          {/* RECENT TRANSACTIONS */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow flex flex-col" style={{ height: '380px' }}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Transactions</h3>

            <div className="flex-1 overflow-auto">
              {loader ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-500 text-sm">Loading transactions...</p>
                </div>
              ) : transactionData?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">

                  {/* Icon */}
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      className="h-5 w-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold text-gray-800">
                    No transactions yet
                  </p>

                  {/* Description */}
                  <p className="mt-1 text-xs text-gray-500 max-w-[220px]">
                    Your recent income and expenses will appear here once you start using your wallets
                  </p>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionData.map(tx => (
                      <tr
                        key={tx.Id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-3 text-gray-700">{tx.Category}</td>
                        <td className="py-3 text-gray-700">{tx.Description}</td>
                        <td className="py-3 text-sm text-gray-500">{new Date(tx.Date).toLocaleDateString()}</td>
                        <td
                          className={`py-3 text-right font-semibold ${tx.Amount < 0 ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {tx.Type === 'Expense' ? '-' : '+'}
                          {tx.Amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>


        </div>

        {/* Charts */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Pie Chart - smaller */}
          <div className="lg:flex-[0.3] flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <CurrencyPieChart data={currencyTotals} />
          </div>

          {/* Currency Converter - larger */}
          <div className="lg:flex-[0.7] flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <CurrencyConverter />
          </div>
        </div>

      </div>
    </div>
  );
}
