"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type Rates = Record<string, number>;

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(100);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [rates, setRates] = useState<Rates>({});
    const [loading, setLoading] = useState(false);

    const currencies = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "PHP",
    ];

    const getLast30Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        const formatDate = (d: Date) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`;
        return { start: formatDate(start), end: formatDate(end) };
    };

    const fetchLatest = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
            );
            const data = await res.json();
            setConvertedAmount(data.rates[toCurrency]);
        } catch (err) {
            console.error("Failed to fetch latest rate:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistorical = async () => {
        try {
            const { start, end } = getLast30Days();
            const res = await fetch(
                `https://api.frankfurter.app/${start}..${end}?from=${fromCurrency}&to=${toCurrency}`
            );
            const data = await res.json();
            setRates(data.rates);
        } catch (err) {
            console.error("Failed to fetch historical rates:", err);
            setRates({});
        }
    };

    useEffect(() => {
        fetchLatest();
        fetchHistorical();
    }, [amount, fromCurrency, toCurrency]);

    return (
        <div className="p-6 bg-gray-50 rounded-2xl shadow-md w-full max-w-6xl mx-auto flex flex-col space-y-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-left">
                Currency Converter
            </h2>

            {/* Converter Inputs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
                <input
                    type="number"
                    className="p-2 rounded border w-full lg:w-32 text-gray-900 placeholder-gray-400"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Amount"
                />

                <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="p-2 rounded border text-gray-900"
                >
                    {currencies.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <span className="font-bold text-lg text-gray-900">→</span>

                <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="p-2 rounded border text-gray-900"
                >
                    {currencies.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <div className="font-semibold text-gray-900 text-lg lg:ml-4">
                    {loading
                        ? "Loading..."
                        : convertedAmount?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                        })}
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded shadow w-full overflow-x-auto">
                {Object.keys(rates).length > 0 ? (
                    <div className="w-[1200px] lg:w-full">
                        <Line
                            data={{
                                labels: Object.keys(rates),
                                datasets: [
                                    {
                                        label: `${fromCurrency} → ${toCurrency}`,
                                        data: Object.values(rates).map((r: any) => r[toCurrency]),
                                        borderColor: "rgb(59, 130, 246)",
                                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                                        tension: 0.3,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: true },
                                    tooltip: { mode: "index", intersect: false },
                                },
                                scales: {
                                    y: { beginAtZero: false },
                                },
                            }}
                            height={400}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80">
                        Loading chart...
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyConverter;
