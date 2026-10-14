import React from "react";
import ForecastChart from "./ForecastChart";
import TrendChart from "./TrendChart";
import SeasonalityChart from "./SeasonalityChart";

const ChartsSection = ({ data }) => {
  return (
    <div className="charts-row">
      <div className="chart-box">
        <h3>Forecast</h3>
        <ForecastChart data={data} />
      </div>
      <div className="chart-box">
        <h3>Trend</h3>
        <TrendChart data={data} />
      </div>
      <div className="chart-box">
        <h3>Seasonality</h3>
        <SeasonalityChart data={data} />
      </div>
    </div>
  );
};

export default ChartsSection;

