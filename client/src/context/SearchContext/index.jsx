

import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SearchContext = createContext(null);

function SearchContextProvider({ children }) {
  const [searchText, setSearchText] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Clear search text when navigating away from /shop
    if (location.pathname !== "/shop") {
      setSearchText("");
    }
    
  }, [location.pathname]);

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchContextProvider;
