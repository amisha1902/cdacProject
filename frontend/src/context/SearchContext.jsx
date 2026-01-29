import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch, location, setLocation }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
