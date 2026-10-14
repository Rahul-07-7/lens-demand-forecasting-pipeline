import React, { useState } from "react";

const InventoryPlanningTable = ({ allocation, stdData, selectedProduct,stockData }) => {
  const [filters, setFilters] = useState({ band: "", risk: "" });

  const productAllocation =
    allocation[selectedProduct]?.product_allocation || [];

  const currentStdData = stdData[selectedProduct] || [];

  if (!currentStdData.length || !productAllocation.length) {
    return (
      <div className="table-section">
        <h3>📊 Inventory Planning</h3>
        <p style={{ color: "orange" }}>
          ⚠ Upload file First
        </p>
      </div>
    );
  }


  const sdValues = currentStdData.map(d => d.std_dev || 0);
  const meanSD =
    sdValues.reduce((a, b) => a + b, 0) / (sdValues.length || 1); /* Mean= ∑xi/n​​ * == meansd */


  const variance =
    sdValues.reduce((sum, val) => sum + Math.pow(val - meanSD, 2), 0) /   /* Variance= ∑(xi​−xˉ)2/n​ */
    (sdValues.length || 1);

  const sdOfSD = Math.sqrt(variance);                                    /*  STANDARD DERIVATION =  σ= ^ ∑i=1 ​(xi​−xˉ)2/n​  */

  const rows = productAllocation.map(item => {
    const stdItem = currentStdData.find(
      s => String(s.product) === String(item.product) 
    );

    const stdDev = stdItem?.std_dev || 0;
    const forecast = item.yearly_forecast || 0;

    const band =
      stdDev > meanSD + sdOfSD
        ? "Core"
        : stdDev < meanSD - sdOfSD
        ? "Tail"
        : "Medium";

    const Z =
      band === "Core"
        ? 2.58
        : band === "Medium"
        ? 1.65
        : 1.65;

    const statisticalSafety = Z * stdDev;
    const minimumSafety = forecast * 0.15;

    const safetyStock = Math.max(
    statisticalSafety,
    minimumSafety
    );
    const bufferedDemand = forecast + safetyStock;
    
    const minStock = Math.max(
    forecast * 0.7,
    forecast - safetyStock
    );

    const maxStock = forecast + (safetyStock * 1.5);

    
    return {
      ...item,
      forecast,
      bufferedDemand,
      band,
      Z,
      stdDev,
      safetyStock,
      minStock,
      maxStock,
      
    };
  });

  const filteredRows = rows.filter(
    r =>
      (!filters.band || r.band === filters.band) &&
      (!filters.risk || r.risk === filters.risk)
  );
  const downloadInventoryExcel = async () => {

  const response = await fetch(
    "http://localhost:5000/download-inventory-excel",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        inventory: filteredRows,
        selectedProduct
      })
    }
  );

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download =
    `${selectedProduct}_inventory.xlsx`;

  a.click();
};
  return (
    <div className="table-section">
      <div  style={{display:"flex" , justifyContent:"space-between",alignItems:"center"}}>
          <h3>📊 Inventory Planning</h3>

          <button className="btn-download" onClick={downloadInventoryExcel}>
            <span> Download Excel</span>
          </button>
      </div>
<div className="table-ww">
      <table className="smart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Forecast</th>
            <th>Buffered</th>

            <th>
              Band
              <select
                onChange={e =>
                  setFilters({ ...filters, band: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="Core">Core</option>
                <option value="Medium">Medium</option>
                <option value="Tail">Tail</option>
              </select>
            </th>

            <th>Z</th>
            <th>Std Dev</th>
            <th>Safety</th>
            <th>Min</th>
            <th>Max</th>


            
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((row, i) => (
            <tr key={i}>
              <td>{row.product}</td>
              <td>{row.forecast}</td>
              <td>{row.bufferedDemand.toFixed(2)}</td>
              <td>{row.band}</td>
              <td>{row.Z}</td>
              <td>{row.stdDev.toFixed(2)}</td>
              <td>{row.safetyStock.toFixed(2)}</td>
              <td>{row.minStock.toFixed(2)}</td>
              <td>{row.maxStock.toFixed(2)}</td>


            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default InventoryPlanningTable;