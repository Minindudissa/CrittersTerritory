import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const CategoryContext = createContext(null);

function CategoryContextProvider({ children }) {
  const [category, setCategory] = useState("All");
  const location = useLocation();

  useEffect(() => {
    // Clear Category text when navigating away from /shop
    if (location.pathname !== "/shop") {
      setCategory("All");
    }
  }, [location.pathname]);

  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContextProvider;
