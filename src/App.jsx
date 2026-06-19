import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReferralDetail from "./pages/ReferralDetail";
import NotFound from "./pages/NotFound";

// IMPORTANT: BrowserRouter lives HERE, not in main.jsx.
// Spec requirement: "main.jsx should render <App /> only, with no router there"
// so the app still works if a host portal only ever mounts <App />.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referral/:id"
          element={
            <ProtectedRoute>
              <ReferralDetail />
            </ProtectedRoute>
          }
        />

        {/* Optional route — spec says it "may redirect to /, same dashboard" */}
        <Route path="/dashboard/referrals" element={<Navigate to="/" replace />} />

        {/* Catch-all must stay PUBLIC — never wrap this in ProtectedRoute */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;