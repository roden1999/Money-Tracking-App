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
