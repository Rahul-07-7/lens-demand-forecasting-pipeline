import React, { useRef, useEffect, useState } from "react";
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
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TrendChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Historical Sales Trend",
        color: "#e2e8f0",
        font: { size: 16 }
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" }
      }
    }
  };

  useEffect(() => {
    if (!data?.historical || !Array.isArray(data.historical)) return;

    const chart = chartRef.current;
    

    const labels = data.historical.map(item => {
      const d = new Date(item.date);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    });
    
    const values = data.historical.map(item => item.sales);

    let backgroundColor = "rgba(34, 197, 94, 0.1)"; 
    if (chart) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (chartArea) {
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.4)");
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
        backgroundColor = gradient;
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Sales",
          data: values,
          borderColor: "#22c55e", 
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 2,
          backgroundColor: backgroundColor,
          fill: true
        },
        {
          label: "Glow",
          data: values,
          borderColor: "rgba(34, 197, 94, 0.15)",
          borderWidth: 10,
          pointRadius: 0,
          tension: 0.4,
          fill: false
        }
      ]
    });
  }, [data]);

  if (!data?.historical) return <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>No data</div>;

  return (
    <div style={{ height: "400px", background: "#111827", padding: "20px", borderRadius: "16px" }}>
      <Line ref={chartRef} data={chartData || { labels: [], datasets: [] }} options={options} />
    </div>
  );
};

export default TrendChart;