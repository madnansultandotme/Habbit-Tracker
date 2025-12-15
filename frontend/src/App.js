import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { HabitsProvider } from "./contexts/HabitsContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
