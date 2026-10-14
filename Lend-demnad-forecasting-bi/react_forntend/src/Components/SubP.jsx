import React from "react";

const SubSubSection = ({ results, subSubData }) => {
  if (!subSubData || subSubData.length === 0) {
    return <p style={{ color: "orange", padding: "20px" }}>⚠ Upload file </p>;
  }

  if (!results || results.length === 0) {
    return <p style={{ padding: "20px", color: "#666" }}>No forecast data. Click "Generate Allocation" to calculate.</p>;
  }


  const rows = [...new Set(results.map(item => item.sub_product || item.SUBP))].sort((a, b) => a - b);
  const columns = [...new Set(results.map(item => item.sub_sub_product || item.SUBP2))].sort((a, b) => a - b);

  const getCellValue = (rowVal, colVal) => {
    const entry = results.find(r => 
      (r.sub_product || r.SUBP) === rowVal && 
      (r.sub_sub_product || r.SUBP2) === colVal
    );

    return entry ? Math.round(entry.forecast).toLocaleString() : "-";
  };
  const downloadPivotExcel = async () => {

  const response = await fetch(
    "http://localhost:5000/download-pivot-excel",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        results
      })
    }
  );

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "pivot_forecast.xlsx";

  a.click();
};

  return (
    <div className="table-section" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3> Forecast Allocation (yearly) </h3>
        <button
           className="btn-download"
           onClick={downloadPivotExcel}
            >
  Download Excel
</button>

      </div>
      
      <div className="table-wrapper" style={{ overflowX: 'auto', maxHeight: '500px', border: '1px solid #eee' }}>
        <table className="smart-table pivot-table">
          <thead>
            <tr>
              <th className="sticky-col">Power / Sph</th>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
              <th className="total-cell">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const rowTotal = results
                .filter(r => (r.sub_product || r.SUBP) === row)
                .reduce((sum, r) => sum + (r.forecast || 0), 0);

              return (
                <tr key={row}>
                  <td className="sticky-col row-label">{row}</td>
                  {columns.map(col => (
                    <td key={col} style={{ textAlign: 'right' }}>
                      {getCellValue(row, col)}
                    </td>
                  ))}
                  <td className="total-cell" style={{ fontWeight: 'bold', textAlign: 'right' }}>
                    {Math.round(rowTotal).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
  .pivot-table { 
    border-collapse: collapse; 
    width: 100%; 
    font-size: 13px; 
    background: #0f172a; 
    color: #e2e8f0;
  }

  .pivot-table th, 
  .pivot-table td { 
    border: 1px solid #334155; 
    padding: 10px; 
    min-width: 70px; 
  }

  .pivot-table th { 
    background: linear-gradient(135deg, #1e293b, #334155); 
    color: #f8fafc; 
    position: sticky; 
    top: 0; 
    z-index: 10; 
    font-weight: 600;
  }

  .pivot-table td {
    background: #020617;
    transition: background 0.2s ease;
  }

  .pivot-table tr:hover td {
    background: #1e293b; 
  }

  .sticky-col { 
    position: sticky; 
    left: 0; 
    background: linear-gradient(135deg, #22221e, #1e293b) !important; 
    font-weight: bold; 
    z-index: 11; 
    border-right: 2px solid #475569; 
    color: #38bdf8;
  }

  .row-label { 
    background: #1e293b !important; 
    color: #facc15; 
  }

  .total-cell { 
    background: #020617 !important; 
    color: #22c55e; 
    font-weight: bold;
  }

  .badge { 
    background: #334155; 
    color: #e2e8f0;
    padding: 4px 10px; 
    border-radius: 6px; 
    font-size: 12px; 
  }

  /* Optional: zebra striping */
  .pivot-table tbody tr:nth-child(even) td {
    background: #020617;
  }

  .pivot-table tbody tr:nth-child(odd) td {
    background: #020617;
  }
`}</style>
    </div>
  );
};

export default SubSubSection;