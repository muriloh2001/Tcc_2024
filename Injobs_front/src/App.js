import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import OnCadasterJob from './pages/OnCadasterJob';
import OnBoardingEmpresa from './pages/OnboardingEmpresa';
import Empresas from './pages/Empresas';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies] = useCookies(['user']);
  const authToken = cookies.AuthToken;

  // Função para verificar se o usuário é uma empresa
  const isCompanyUser = () => {
    if (!authToken) return false;
    const userRole = JSON.parse(atob(authToken.split('.')[1])).role; // Supondo que o token contém a role
    return userRole === 'empresa';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboardingEmpresa" element={<OnBoardingEmpresa />} />
            <Route path="/empresas" element={<Empresas />} /> {/* Rota para visualizar empresas */}
            {isCompanyUser() ? (
              <Route path="/onCadasterJob" element={<OnCadasterJob />} /> // Apenas empresas podem acessar
            ) : (
              <Route path="/onCadasterJob" element={<Navigate to="/" />} /> // Redireciona se não for empresa
            )}
          </>
        ) : (
          <>
            <Route path="/onboardingEmpresa" element={<OnBoardingEmpresa />} />
            <Route path="/onCadasterJob" element={<Navigate to="/" />} /> // Redireciona para home se não estiver autenticado
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
