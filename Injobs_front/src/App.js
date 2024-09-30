import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DashboardCandidato from './pages/DashboardCandidato';
import Onboarding from './pages/Onboarding';
import OnCadasterJob from './pages/OnCadasterJob';
import OnBoardingEmpresa from './pages/OnboardingEmpresa';
import Empresas from './pages/Empresas';
import EditarPerfil from './pages/OnboardingEmpresa'; // Usando a mesma página
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['user']);
  const authToken = cookies.AuthToken;

  const isCompanyUser = () => {
    if (!authToken) return false;
    const userRole = JSON.parse(atob(authToken.split('.')[1])).role;
    return userRole === 'empresa';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-candidato" element={<DashboardCandidato />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboardingEmpresa" element={<OnBoardingEmpresa />} />
            <Route path="/empresas" element={<Empresas />} />
            {isCompanyUser() ? (
              <Route path="/onCadasterJob" element={<OnCadasterJob />} />
            ) : (
              <Route path="/onCadasterJob" element={<Navigate to="/" />} />
            )}
          </>
        ) : (
          <>
            <Route path="/onboardingEmpresa" element={<OnBoardingEmpresa />} />
            <Route path="/onCadasterJob" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
