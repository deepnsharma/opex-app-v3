import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InitiativeForm from "./pages/InitiativeForm";
import WorkflowManagement from "./pages/WorkflowManagement";
import ProjectTracking from "./pages/ProjectTracking";
import KPITracking from "./pages/KPITracking";
import InitiativeClosure from "./pages/InitiativeClosure";
import Reports from "./pages/Reports";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <AuthProvider>
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
              path="/initiatives/new"
              element={
                <ProtectedRoute>
                  <InitiativeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow"
              element={
                <ProtectedRoute>
                  <WorkflowManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kpi-tracking"
              element={
                <ProtectedRoute>
                  <KPITracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/closure"
              element={
                <ProtectedRoute>
                  <InitiativeClosure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;