"use client";

import React, { createContext, useContext, useState } from "react";

export type TabType = "dashboard" | "expenses" | "insights";

interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: "dashboard",
  setActiveTab: () => {},
});

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  return useContext(TabContext);
}
