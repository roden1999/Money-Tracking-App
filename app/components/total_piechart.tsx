"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Props type
type CurrencyCode = "PHP" | "USD" | "EUR" | "JPY" | "GBP";

interface CurrencyPieChartProps {
    data: Record<CurrencyCode, number>;
}

const CurrencyPieChart: React.FC<CurrencyPieChartProps> = ({ data }) => {
    const hasData = Object.values(data).some(value => value > 0);

    if (!hasData) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md p-6 w-full h-full flex flex-col items-center justify-center text-center border border-gray-100">

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 13l3-3 4 4 5-6" />
                    </svg>
                </div>

                {/* Title */}
                <p className="text-sm font-semibold text-gray-800">
                    No balances yet
                </p>

                {/* Description */}
                <p className="mt-1 text-xs text-gray-500 max-w-[220px]">
                    Add your first wallet to start tracking and visualizing your finances 📊
                </p>
            </div>
        );
    }
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: "Total Balance by Currency",
                data: Object.values(data),
                backgroundColor: [
                    "rgba(59, 130, 246, 0.8)", // blue
                    "rgba(16, 185, 129, 0.8)", // green
                    "rgba(99, 102, 241, 0.8)", // indigo
                    "rgba(253, 186, 116, 0.8)", // yellow/orange
                    "rgba(239, 68, 68, 0.8)", // red
                ],
                borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: "#111827", // Tailwind gray-900
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: "Total Balance by Currency",
                color: "#111827",
                font: {
                    size: 18,
                    weight: "bold" as const,
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl mx-auto">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default CurrencyPieChart;
