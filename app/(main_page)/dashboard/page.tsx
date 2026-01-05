'use client';

export default function DashboardPage() {
  // TEMP mock data (replace with API later)
  const wallets = [
    { id: 1, name: 'Cash', balance: 3500 },
    { id: 2, name: 'GCash', balance: 8200 },
    { id: 3, name: 'Bank', balance: 15000 },
  ];

  const transactions = [
    { id: 1, title: 'Groceries', amount: -450, date: '2025-01-10' },
    { id: 2, title: 'Salary', amount: 25000, date: '2025-01-05' },
    { id: 3, title: 'Coffee', amount: -120, date: '2025-01-03' },
  ];

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your finances</p>
        </div>

        {/* TOTAL MONEY */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">Total Balance</p>
          <h2 className="mt-2 text-4xl font-bold">
            ₱ {totalBalance.toLocaleString()}
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* WALLETS */}
          <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              My Wallets
            </h3>

            <ul className="space-y-4">
              {wallets.map(wallet => (
                <li
                  key={wallet.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-700">
                    {wallet.name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₱ {wallet.balance.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr
                    key={tx.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-3 text-gray-700">{tx.title}</td>
                    <td className="py-3 text-sm text-gray-500">{tx.date}</td>
                    <td
                      className={`py-3 text-right font-semibold ${
                        tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {tx.amount < 0 ? '-' : '+'}₱
                      {Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
