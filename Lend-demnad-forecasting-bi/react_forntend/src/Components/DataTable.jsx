import React, { useState, useEffect } from "react";

const DataTable = ({ data }) => {
  const models = ["Ensemble"];
  const [activeModel, setActiveModel] = useState("Ensemble");
  

  

  useEffect(() => {
    if (data?.best_model) setActiveModel(data.best_model);
  }, [data]);

  if (!data?.forecast) {
    return <div className="dt-no-data">No forecast data available.</div>;
  }

  const forecastData = data.forecast;

  const downloadExcel = async () => {
    try {
      const response = await fetch("http://localhost:5000/download-excel");
      if (!response.ok) throw new Error("Failed to download file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Sales_Forecast_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="dt-container">
      
      <div className="dt-header">
        <div className="dt-header-left">
          <h3 className="dt-title">Model Forecasts</h3>
          <div className="dt-model-selector">
            {models.map((m) => (
              <button
                key={m}
                onClick={() => setActiveModel(m)}
                className={`dt-model-btn ${activeModel === m ? "active" : ""}`}
              >
                {m} {m === data.best_model && "★"}
              </button>
            ))}
          </div>
        </div>

        <div className="dt-header-right">
          <button onClick={downloadExcel} className="btn-download">
            Download Excel
          </button>
        </div>
      </div>

      <div className="dt-scroll-area">
        <table className="dt-table">
          <thead>
            <tr style={{textAlign:"end"}}>
              <th>Month</th>
              <th className="text-right">Forecast Sales</th>
              <th className="text-center">Confidence Range (Min - Max)</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((row, i) => (
              <tr key={i}>
                <td className="dt-date-cell">
                  {row.date
                    ? new Date(row.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })
                    : "-"}
                </td>

                <td className="dt-sales-cell text-right">
                  {(row.forecast_sales ?? 0).toLocaleString()}
                </td>

                <td className="dt-range-cell">
                  <div className="dt-range-flex">
                    <span className="dt-badge dt-min">
                      <small>MIN</small>
                      {(row.min_sales ?? 0).toLocaleString()}
                    </span>
                    <div className="dt-connector"></div>
                    <span className="dt-badge dt-max">
                      <small>MAX</small>
                      {(row.max_sales ?? 0).toLocaleString()}
                    </span>
                  </div>
                </td>
              </tr>
              
            ))}
            <tr className="dt-total-row">
  <td><strong>Total</strong></td>

  <td className="dt-sales-cell text-right">
    <strong>
      {forecastData
        .reduce((sum, row) => sum + (row.forecast_sales ?? 0), 0)
        .toLocaleString()}
    </strong>
  </td>

  <td className="dt-range-cell">
    <div className="dt-range-flex">
      <span className="dt-badge dt-min">
        <small>MIN</small>
        <strong>
          {forecastData
            .reduce((sum, row) => sum + (row.min_sales ?? 0), 0)
            .toLocaleString()}
        </strong>
      </span>

      <div className="dt-connector"></div>

      <span className="dt-badge dt-max">
        <small>MAX</small>
        <strong>
          {forecastData
            .reduce((sum, row) => sum + (row.max_sales ?? 0), 0)
            .toLocaleString()}
        </strong>
      </span>
    </div>
  </td>
</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;