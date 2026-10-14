import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getSalesForecast } from "./api";

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


const options = {
  responsive: true,
  maintainAspectRatio: false, 
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#94a3b8', 
        font: { size: 12 }
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)'
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)' 
      },
      ticks: {
        color: '#94a3b8' 
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
};

const SalesForecastChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let result;

        if (data) {

          result = data;
        } else {

          result = await getSalesForecast();
        }

        if (!result || !result.forecast) {
          throw new Error("Invalid forecast format");
        }

        const labels = result.forecast.map(item => item.month.slice(0, 7));
        const values = result.forecast.map(item => item.forecast_sales);

        setChartData({
          labels,
          datasets: [
            {
              label: `Forecast (${result.best_model || "Model"})`,
              data: values,
              borderColor: "#3b82f6", 
              backgroundColor: "rgba(59, 130, 246, 0.1)", 
              fill: true,
              tension: 0.3,
              pointBackgroundColor: "#3b82f6",
              pointHoverRadius: 6
            }
          ]
        });
      } catch (err) {
        console.error("Chart error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  if (loading) return <p style={{ color: "#94a3b8", padding: "20px" }}>Loading chart...</p>;
  if (error) return <p style={{ color: "#ef4444", padding: "20px" }}>Error: {error}</p>;
  if (!chartData) return <p style={{ color: "#94a3b8", padding: "20px" }}>No data available</p>;

  return (
    
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "280px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesForecastChart;