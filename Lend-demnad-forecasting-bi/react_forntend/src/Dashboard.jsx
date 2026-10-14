import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import ForecastChart from "./Components/ForecastChart";
import SeasonalityChart from "./Components/SeasonalityChart";
import TrendChart from "./Components/TrendChart";
import DataTable from "./Components/DataTable";
import UploadCard from "./Components/UplodeSection";
import AllocationSection from "./Components/Allocation";
import InventoryPlanningTable from "./Components/Inventory";
import SubSubSection from "./Components/SubP";
import InventoryPlanningTablePivot from "./Components/InventoryPlanningTablePivot";

const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(() => localStorage.getItem("selectedProduct") || null);
  const [productData, setProductData] = useState(() => JSON.parse(localStorage.getItem("productData")) || {});
  const [subProductData, setSubProductData] = useState(() => JSON.parse(localStorage.getItem("subProductData")) || []);
  const [allocation, setAllocation] = useState(() => JSON.parse(localStorage.getItem("allocation")) || {});
  const [stdData1, setStdData1] = useState(() => JSON.parse(localStorage.getItem("stdData1")) || {});
  
  const [stdData2, setStdData2] = useState(() => {
  const saved = JSON.parse(localStorage.getItem("stdData2"));
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  });

  const [subSubData, setSubSubData] = useState(() => JSON.parse(localStorage.getItem("subSubData")) || []);
  
  const [subSubResults, setSubSubResults] = useState(() => {
  const saved = JSON.parse(localStorage.getItem("subSubResults"));
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  });
  const [stockFile, setStockFile] = useState(null);

  const [stockData, setStockData] = useState(() => {
  const saved = localStorage.getItem("stockData");
  return saved ? JSON.parse(saved) : [];
});
const currentData = productData[selectedProduct];


const isToric = selectedProduct && 
    ["AOS 53", "AOS 54", "AOS 57", "AOS 59", "AOS 47T"].includes(selectedProduct.trim());

  

const handleStdPivotUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:5000/calculate-std-pivot", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  
  setStdData2(prev => ({
  ...prev,
  [selectedProduct]: data
}));
};

   const handleAllocationAction = async () => {  
    if (!currentData?.forecast || subProductData.length === 0) {
      return alert("Please upload Sales History + Sub-Product List first");
    }
    try {
      const res = await fetch("http://localhost:5000/allocate", {   
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forecast: currentData.forecast,
          sub_products: subProductData
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server Error:", errText);
        alert("Allocation Failed: " + errText);
        return;
      }

      const data = await res.json();
      setAllocation(prev => ({ ...prev, [selectedProduct]: data }));
    } catch (err) { 
      alert("Something went wrong. Check console.");
    }
  };

  const handleStockUpload = async (file) => {
  if (!file) {
    alert("Upload stock file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:5000/upload-current-stock", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  setStockData(prev => ({
  ...prev,
  [selectedProduct]: data
}));
};

  const handleHierarchicalAllocation = async () => {  
    if (!currentData?.forecast || subSubData.length === 0) {
      return alert("Please upload Sales History + Sub-sub-Product List first");
    }

    try {
      const res = await fetch("http://localhost:5000/allocate-hierarchical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forecast: currentData.forecast,
          mapping_data: subSubData
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server Error:", errText);
        alert("Pivot Allocation Failed: " + errText);
        return;
      }

      const data = await res.json();
      setAllocation(prev => ({
        ...prev,
        [selectedProduct]: { product_allocation: data.sub_allocation || [] }
      }));
    setSubSubResults(prev => ({
    ...prev,
     [selectedProduct]: data.subsub_allocation || []
    }));
    } catch (err) {
    }
  };

 

  const handleMainUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/upload-and-forecast", { method: "POST", body: formData });
    const data = await res.json();
    setProductData(prev => ({ ...prev, [selectedProduct]: data }));
  };

  const handleSubUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/upload-subproducts", { method: "POST", body: formData });
    const data = await res.json();
    setSubProductData(data);

  };

  const handleStdUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/calculate-std", { method: "POST", body: formData });
    const data = await res.json();
    setStdData1(prev => ({ ...prev, [selectedProduct]: data }));
  };

  const handleSubSubUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/upload-subsub", { method: "POST", body: formData });
    const data = await res.json();
    setSubSubData(data);
  };



  useEffect(() => {
    localStorage.setItem("selectedProduct", selectedProduct || "");
    localStorage.setItem("productData", JSON.stringify(productData));
    localStorage.setItem("subProductData", JSON.stringify(subProductData));
    localStorage.setItem("allocation", JSON.stringify(allocation));
    localStorage.setItem("stdData1", JSON.stringify(stdData1));
    localStorage.setItem("stdData2", JSON.stringify(stdData2));
    localStorage.setItem("subSubData", JSON.stringify(subSubData)); 
    localStorage.setItem("subSubResults", JSON.stringify(subSubResults));
  }, [selectedProduct, productData, subProductData, allocation, stdData1, stdData2,subSubData, subSubResults]);

  useEffect(() => {
  localStorage.setItem("stockData", JSON.stringify(stockData));
  }, [stockData]);

const clearCurrentProductData = () => {
  if (!selectedProduct) return;

  if (window.confirm(`Clear data for ${selectedProduct}?`)) {
    
    const updatedProductData = { ...productData };
    delete updatedProductData[selectedProduct];

    const updatedAllocation = { ...allocation };
    delete updatedAllocation[selectedProduct];

    const updatedStdData1 = { ...stdData1 };
    delete updatedStdData1[selectedProduct];

    const updatedStdData2 = { ...stdData2 };
    delete updatedStdData2[selectedProduct];

    const updatedSubSubResults = { ...subSubResults };
    delete updatedSubSubResults[selectedProduct];

    const updatedStockData = { ...stockData };
    delete updatedStockData[selectedProduct];

    
    setProductData(updatedProductData);
    setAllocation(updatedAllocation);
    setStdData1(updatedStdData1);
    setStdData2(updatedStdData2);
    setSubSubResults(updatedSubSubResults);
    setStockData(updatedStockData);

    setSubProductData([]);
    setSubSubData([]);

    alert(`✅ Data cleared for ${selectedProduct}`);
  }
};



  return (
    <div className="layout">
      <Sidebar setSelectedProduct={setSelectedProduct} />
      <div className="main">
        {!selectedProduct ? (
          <h2>Select a Product from Sidebar</h2>
        ) : (
          <>
            <h2>📦 {selectedProduct} ({isToric ? "Toric Flow" : "Non-Toric Flow"})</h2>
           

            <div className="upload-grid" >
              <UploadCard title="1. Uplode Product Sales (Month wise)" onUpload={handleMainUpload} />

              {!isToric ? (
                <>
                  <UploadCard title="2. Uplode Total Sales Power(D) Wise" onUpload={handleSubUpload} />
                  <UploadCard title="3. Uplode Sales for Inventory Table" onUpload={handleStdUpload} />
                  
                </>
              ) : (
                <>
                  <UploadCard title="2.  Uplode Total Sales Power(D) and Sph" onUpload={handleSubSubUpload} />
                  <UploadCard title="3. Uplode Sales for Inventory Table" onUpload={handleStdPivotUpload} />
                
                 
                </>
              )}
            </div>

            <div className="charts-row">
              <div className="chart-box"><h3>Forecast Chart</h3><ForecastChart data={currentData} /></div>
              <div className="chart-box"><h3>Trend Chart</h3><TrendChart data={currentData} /></div>
              <div className="chart-box"><h3>Seasonality Chart</h3><SeasonalityChart data={currentData} /></div>
            </div>

            <DataTable data={currentData} />

            {!isToric ? (
              <AllocationSection
                allocation={allocation}
                selectedProduct={selectedProduct}
                onAllocate={handleAllocationAction}
                subProductData={subProductData}
              />
            ) : (
              <>
                <div className="table-section">
                  <div class="btn-wrapper" style={{marginTop: 10}}>
                   <button class="btn" onClick={handleHierarchicalAllocation} >
                       <svg class="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                       <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z">
                        </path>
                        </svg>

                   <div class="txt-wrapper">
                       <div class="txt-1">
                       <span class="btn-letter">G</span>
                       <span class="btn-letter">e</span>
                       <span class="btn-letter">n</span>
                       <span class="btn-letter">e</span>
                       <span class="btn-letter">r</span>
                       <span class="btn-letter">a</span>
                       <span class="btn-letter">t</span>
                       <span class="btn-letter">e</span>
                       </div>
                      <div class="txt-2">
                      <span class="btn-letter">G</span>
                      <span class="btn-letter">e</span>
                      <span class="btn-letter">n</span>
                      <span class="btn-letter">e</span>
                      <span class="btn-letter">r</span>
                      <span class="btn-letter">a</span>
                      <span class="btn-letter">t</span>
                      <span class="btn-letter">i</span>
                      <span class="btn-letter">n</span>
                      <span class="btn-letter">g</span>
                      </div>
                   </div>
                   </button>
                  </div>
                </div>

                <SubSubSection
                  allocation={allocation}
                  selectedProduct={selectedProduct}
                  subSubData={subSubData}
                  results={subSubResults[selectedProduct] || []}
                />
              </>
            )}

           {!isToric ? (
              <InventoryPlanningTable
              allocation={allocation}
              stdData={stdData1}
              selectedProduct={selectedProduct}
              stockData={stockData[selectedProduct] || []}
           />
           
          ) : (
  <InventoryPlanningTablePivot
    allocation={allocation}
    stdData={stdData2[selectedProduct] || []}
    selectedProduct={selectedProduct}
    stockData={stockData[selectedProduct] || []}
    subSubResults={subSubResults[selectedProduct] || []}
  />

  )}
  </>
  )}
       
<button class="button-d"  onClick={clearCurrentProductData}>
  <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
</button>
      </div>
      
    </div>
  );
};

export default Dashboard;