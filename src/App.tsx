import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import AuditHistory from "./pages/AuditHistory";
import AuditResult from "./pages/AuditResult";
import PageDetails from "./pages/PageDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audits" element={<AuditHistory />} />
        <Route path="/audits/:id" element={<AuditResult />} />
        <Route
          path="/audits/:auditId/pages/:pageId"
          element={<PageDetails />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;