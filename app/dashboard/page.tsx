"use client"

import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { MainContent } from "./components/MainContent"
import { RightPanel } from "./components/RightPanel"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
      <RightPanel />
    </div>
  )
}

