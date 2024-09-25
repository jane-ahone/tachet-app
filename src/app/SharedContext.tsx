"use client";

import React, { createContext, useState, useContext } from "react";

interface SharedContextType {
  sharedData: Record<string, any> | undefined;
  setSharedData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const SharedContext = createContext<SharedContextType | undefined>(undefined);

interface SharedProvider {
  children: React.ReactNode;
}

export const SharedProvider: React.FC<SharedProvider> = ({ children }) => {
  const [sharedData, setSharedData] = useState<Record<string, Array<any>>>({
    customers: [],
    tappers: [],
    orders: [],
  });
  return (
    <SharedContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </SharedContext.Provider>
  );
};

export function useSharedContext(): SharedContextType {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error("useSharedContext must be used within a SharedProvider");
  }
  return context;
}
