"use client";
import { useState } from "react";

export default function PricingToggle() {
  const [isAnnual, setIsAnnual] = useState(false);

  const togglePricing = () => {
    setIsAnnual(!isAnnual);
    
    // Update pricing display
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const annualOnlyElements = document.querySelectorAll('.annual-only');
    
    monthlyPrices.forEach(el => {
      el.classList.toggle('d-none', isAnnual);
    });
    
    annualPrices.forEach(el => {
      el.classList.toggle('d-none', !isAnnual);
    });
    
    annualOnlyElements.forEach(el => {
      el.classList.toggle('d-none', !isAnnual);
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mb-4">
      <span className="me-3">Mensal</span>
      <div className="form-check form-switch">
        <input 
          className="form-check-input" 
          type="checkbox" 
          id="pricingToggle"
          checked={isAnnual}
          onChange={togglePricing}
        />
        <label className="form-check-label" htmlFor="pricingToggle"></label>
      </div>
      <span className="ms-3">Anual <span className="badge bg-success">-20%</span></span>
    </div>
  );
}