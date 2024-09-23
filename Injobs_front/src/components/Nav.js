import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaHouse } from 'react-icons/fa6';

const Nav = ({
  setShowModal,
  showModal,
  setIsSignUp,
  setShowModal2,
  showModal2,
  setIsSignUp2,
}) => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const handleClick = () => {
    setShowModal(true);  // Certifique-se de que essa função está sendo passada corretamente como prop
    setIsSignUp(false);  // Modo de login
  };

  const handleClick2 = () => {
    setShowModal2(true);
    setIsSignUp2(false);  // Modo de login
  };

  const authToken = false;

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <nav>
      {currentPath === '/' && !authToken && (
        <>
          <button
            className="primary-button-login-cand"
            onClick={handleClick}
            disabled={showModal}
          >
            Login Candidato
          </button>
          <button
            className="primary-button-login-emp"
            onClick={handleClick2}
            disabled={showModal2}
          >
            Login Empresa
          </button>
        </>
      )}

      {(currentPath === '/dashboard' ||
        currentPath === '/onBoarding' ||
        currentPath === '/onBoardingEmpresa' ||
        currentPath === '/onCadasterJob') && (
        <>
          <div className="logo-container">
            <Link to="/dashboard" className="home-icon">
              <FaHouse />
            </Link>

            <input
              type="text"
              placeholder="Search keywords..."
              className="search-bar"
            />
          </div>

          <Link to="/onBoardingEmpresa" className="primary-button-edit-profile">
            Editar Perfil
          </Link>
        </>
      )}

      {(currentPath === '/dashboard' ||
        currentPath === '/onBoardingEmpresa' ||
        currentPath === '/onCadasterJob') &&
        !authToken && (
          <Link to="/onCadasterJob" className="primary-button-criar-vaga">
            Publicar Vaga
          </Link>
        )}
    </nav>
  );
};

export default Nav;
