import { Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import Home from "./pages/Home";
import AdminPanel from "./admin/AdminPanel";

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </DataProvider>
  );
}
export default App;
