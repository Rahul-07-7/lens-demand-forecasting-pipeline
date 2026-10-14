import React, { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SeasonalityChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Average Monthly Seasonality",
        color: "#e2e8f0",
        font: { size: 16 }
      }
    },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { display: false } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(255,255,255,0.05)" } }
    }
  };

  useEffect(() => {
    if (!data?.historical) return;

    const monthSums = Array(12).fill(0);
    const monthCounts = Array(12).fill(0);

    data.historical.forEach(item => {
      const date = new Date(item.date);
      if (!isNaN(date)) {
        const monthIndex = date.getMonth();
        monthSums[monthIndex] += item.sales;
        monthCounts[monthIndex]++;
      }
    });

    const averages = monthSums.map((sum, i) => (monthCounts[i] > 0 ? sum / monthCounts[i] : 0));  /* Average Sales for Month= Number of Records in Month/Total Sales in Month​ */
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chart = chartRef.current;
    let backgroundColor = "rgba(245, 158, 11, 0.7)";

    if (chart) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (chartArea) {
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "#f59e0b"); 
        gradient.addColorStop(1, "rgba(245, 158, 11, 0.2)");
        backgroundColor = gradient;
      }
    }

    setChartData({
      labels: monthNames,
      datasets: [
        {
          label: "Avg Sales",
          data: averages,
          backgroundColor: backgroundColor,
          borderRadius: 6,
          borderWidth: 0
        }
      ]
    });
  }, [data]);

  if (!data?.historical) return <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>No data</div>;

  return (
    <div style={{ height: "400px", background: "#111827", padding: "20px", borderRadius: "16px" }}>
      <Bar ref={chartRef} data={chartData || { labels: [], datasets: [] }} options={options} />
    </div>
  );
};

export default SeasonalityChart;