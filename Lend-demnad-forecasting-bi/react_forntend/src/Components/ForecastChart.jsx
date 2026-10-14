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
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ForecastChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Sales Forecast",
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
        grid: { color: "rgba(255, 255, 255, 0.05)" } 
      }
    }
  };

  useEffect(() => {
    if (!data?.forecast || !Array.isArray(data.forecast)) return;

    const labels = data.forecast.map(item => {
     
      const d = new Date(item.date || item.month); 
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    });
    
    const forecastValues = data.forecast.map(item => item.forecast_sales);
    const upperValues = data.forecast.map(item => item.max_sales || item.upper_sales);
    const lowerValues = data.forecast.map(item => item.min_sales || item.lower_sales);

    setChartData({
      labels,
      datasets: [
        {
          label: "Upper",
          data: upperValues,
          borderWidth: 0,
          pointRadius: 0,
          fill: false
        },
        {
          label: "Range",
          data: lowerValues,
          borderWidth: 0,
          pointRadius: 0,

          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "rgba(94,114,228,0.2)"; 
            
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "rgba(94,114,228,0.25)");
            gradient.addColorStop(1, "rgba(94,114,228,0)");
            return gradient;
          },
          fill: "-1" 
        },
        {
          label: "Glow",
          data: forecastValues,
          borderColor: "rgba(94,114,228,0.08)",
          borderWidth: 10,
          pointRadius: 0,
          tension: 0.4,
          fill: false
        },
        {
          label: "Forecast",
          data: forecastValues,
          borderColor: "#5e72e4",
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#5e72e4",
          fill: false
        }
      ]
    });
  }, [data]);

 
  if (!data?.forecast) {
    return (
      <div style={{ color: "#94a3b8", textAlign: "center", padding: "50px", background: "#111827", borderRadius: "16px" }}>
        No forecast data available
      </div>
    );
  }


  if (!chartData) {
    return (
      <div className="chart-status-msg error-msg">
        No forecast data available
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-status-msg loading-msg">
        Preparing chart layout...
      </div>
    );
  }

  return (
    <div className="forecast-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ForecastChart;