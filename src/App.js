import { Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import Home from "./pages/Home";
import AdminPanel from "./admin/AdminPanel";
import { isConfigValid } from "./firebase";

function App() {
  console.log('App component rendering...');
  return (
    <DataProvider>
      {!isConfigValid && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeeba',
          textAlign: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <strong>Warning:</strong> Firebase configuration is missing. Portfolio data will be loaded from cache or defaults.
          <br />
          Please update <code>src/firebase.js</code> with your Firebase project credentials.
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </DataProvider>
  );
}
export default App;
