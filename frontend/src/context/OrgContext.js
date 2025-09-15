import React, { createContext, useContext, useState, useMemo } from 'react';

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [data, setData] = useState({
    name: 'Your Organization',
    logo: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
    userData,
    setUserData
  }), [data, loading, error, userData]);

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganizationContext must be used within OrganizationProvider');
  }
  return context;
};

export default useOrganizationContext;
