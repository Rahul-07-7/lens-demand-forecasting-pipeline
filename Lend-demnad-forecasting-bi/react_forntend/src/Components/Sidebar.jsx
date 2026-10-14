import React, { useState , useEffect} from "react";
import { useRef } from "react";


const productGroups = {
  "Non-Toric": ["AOS 43", "AOS 44", "AOS 45", "AOS 46", "AOS 50" ,"AOS 52", "AOS 56"],
  "Toric": ["AOS 53", "AOS 54", "AOS 57", "AOS 59", "AOS 47T"]
};

const Sidebar = ({ setSelectedProduct }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(prev => (prev === category ? null : category));
  };
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.classList.contains('sidebar-toggle')) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  return ( 
     <div>
    <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle navigation sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>
     
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>

      <h2 className="sidebar-title">Adtech</h2>


      {Object.keys(productGroups).map((category) => (
        <div key={category} className="category-box">

          <div
            className="category-header"
            onClick={() => toggleCategory(category)}
          >
            <span>{category}</span>
            <span className="arrow">
              {openCategory === category ? "▲" : "▼"}
            </span>
          </div>

          {openCategory === category && (
            <div className="product-list">
              {productGroups[category].map((product) => (
                <div
                  key={product}
                  className="product-item"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product}
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
    </div>
  );
};

export default Sidebar;