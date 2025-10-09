import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ProductTypeContext = createContext(null);

function ProductTypeContextProvider({ children }) {
  const [productType, setProductType] = useState("All");
  const location = useLocation();

  useEffect(() => {
    // Clear ProductType text when navigating away from /shop
    if (location.pathname !== "/shop") {
      setProductType("All");
    }
  }, [location.pathname]);

  return (
    <ProductTypeContext.Provider value={{ productType, setProductType }}>
      {children}
    </ProductTypeContext.Provider>
  );
}

export default ProductTypeContextProvider;
