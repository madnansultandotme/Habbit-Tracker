import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HabitsProvider } from "./contexts/HabitsContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <HabitsProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </div>
      </HabitsProvider>
    </ThemeProvider>
  );
}

export default App;
