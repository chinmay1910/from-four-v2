import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/sidebar_components/overview/Layout";
import Workorder from "./components/Workorder";
import ReportPage from "./components/sidebar_components/reports/ReportPage";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="dashbaord" element={<Dashboard />} />
          <Route path="workorder" element={<Workorder />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />


      </Routes>
    </Router>
  );
}

export default App;
