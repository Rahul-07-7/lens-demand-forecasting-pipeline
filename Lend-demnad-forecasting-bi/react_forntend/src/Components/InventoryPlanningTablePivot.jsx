import React, { useState } from "react";

const InventoryPlanningTablePivot = ({
  allocation,
  stdData,
  selectedProduct,
  stockData,
  subSubResults
}) => {

const [filters, setFilters] = useState({ band: "", risk: "" });

const stdList = Array.isArray(stdData) ? stdData : [];

  if (!subSubResults.length || !stdList.length) {
    return (
      <div className="table-section">
        <h3>📊 Inventory Planning</h3>
        <p style={{ color: "orange" }}>
          ⚠ Upload File 
        </p>
      </div>
    );
  }

const sdValues = stdList.map(d => d.std_dev || 0);

const meanSD =
  sdValues.reduce((a, b) => a + b, 0) / (sdValues.length || 1); /* Mean= ∑xi/n​​ * == meansd */

const variance =
  sdValues.reduce((sum, val) => sum + Math.pow(val - meanSD, 2), 0) /
  (sdValues.length || 1);                                      /* Variance= ∑(xi​−xˉ)2/n​ */

const sdOfSD = Math.sqrt(variance);                           /*  STANDARD DERIVATION =  σ= ^ ∑i=1 ​(xi​−xˉ)2/n​  */

  const rows = subSubResults.map(item => {


  const stdItem = stdList.find(s => {

  const power1 = String(s.Power)
    .trim();

  const power2 = String(item.sub_product)
    .trim();

  const sph1 = String(s.PowSph)
    .trim();

  const sph2 = String(item.sub_sub_product)
    .trim();

  return (
    power1 === power2 &&
    sph1 === sph2
  );
});

    const stdDev = stdItem?.std_dev || 0;
    const forecast = item.forecast || 0;

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

    const safetyStock = Z * stdDev;
    const bufferedDemand = forecast + safetyStock;
    const minStock = forecast - safetyStock;
    const maxStock = forecast + safetyStock;

    

    

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

  const grouped = {};

  filteredRows.forEach(row => {
    const key = row.sub_product;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(row);
  });

 const downloadInventoryExcel = async () => {

  const response = await fetch(
    "http://localhost:5000/download-inventoryPivot-excel",
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
      <div style={{display:"flex", justifyContent:"space-between" , alignItems:"center"}}>
        <h3>📊 Inventory Planning</h3>
      <button className="btn-download" onClick={downloadInventoryExcel}> Download Excel </button>
      </div>
      

      <div className="table-ww">
        <table className="smart-table">
          <thead>
            <tr>
              <th>Power (D)</th>
              <th>Sph</th>
              <th>Forecast</th>
              <th>Buffered Demand</th>

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
                </select>
              </th>

              <th>Z</th>
              <th>Std Dev</th>
              <th>Safety</th>
              <th>Min Stock</th>
              <th>Max stock</th>


              
            </tr>
          </thead>

          <tbody>
            {Object.entries(grouped).map(([subProduct, items]) =>
              items.map((row, i) => (
                <tr key={subProduct + i}>

                  {i === 0 ? (
                    <td rowSpan={items.length}>{subProduct}</td>
                  ) : null}

                  <td>{row.sub_sub_product}</td>
                  <td>{row.forecast}</td>
                  <td>{row.bufferedDemand.toFixed(2)}</td>
                  <td>{row.band}</td>
                  <td>{row.Z}</td>
                  <td>{Number(row.stdDev || 0).toFixed(2)}</td>
                  <td>{row.safetyStock.toFixed(2)}</td>
                  <td>{row.minStock.toFixed(2)}</td>
                  <td>{row.maxStock.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPlanningTablePivot;