import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import AuthModalEmpresa from "../components/AuthModalEmpresa";
import { useState } from 'react';
import { useCookies } from "react-cookie";

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, removeCookie] = useCookies(['user']);
    
    const [showModal2, setShowModal2] = useState(false);  // Modal da empresa
    const [isSignUp2, setIsSignUp2] = useState(true);     // Alternar entre cadastro/login da empresa
    const [showModalCadastro, setShowModalCadastro] = useState(false); // Novo estado para o modal de cadastro
    const [errorMessage, setErrorMessage] = useState('');

    const authToken = cookies.AuthToken;

    const handleAuthClick = () => {
        if (authToken) {
            removeCookie('UserId', cookies.UserId);
            removeCookie('AuthToken', cookies.AuthToken);
            window.location.reload();
            return;
        }
        setShowModal(true);
        setIsSignUp(true);  // Para criar conta
    };

    const handleCompanyClick = () => {
        setShowModal2(true);
        setIsSignUp2(true);  // Para criar conta da empresa
    };

    const handleCadastroClick = () => {
        setShowModalCadastro(true); // Abre o modal de cadastro do candidato
    };

    return (
        <div className="overlay">
            <Nav
                setShowModal={setShowModal}    // Passando a função corretamente para o componente Nav
                showModal={showModal}
                setIsSignUp={setIsSignUp}
                setShowModal2={setShowModal2}
                showModal2={showModal2}
                setIsSignUp2={setIsSignUp2}
            />
            <h1 className="primary-title">Bem-Vindo</h1>
            <img src="logo192.png" alt="Logo" />
            <div className="home">
                <h3>Primeira vez por aqui? Crie seu acesso</h3>
                <button className="primary-button2" onClick={handleCompanyClick}>
                    Conta Empresa
                </button>
                <button className="secondary-button" onClick={handleCadastroClick}>
                    Cadastro Candidato
                </button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {showModal && (
                    <AuthModal 
                        setShowModal={setShowModal} 
                        isSignUp={isSignUp} 
                        setErrorMessage={setErrorMessage} 
                    />
                )}

                {showModal2 && (
                    <AuthModalEmpresa 
                        onClose={() => setShowModal2(false)} // Fecha o modal
                        isSignUp={isSignUp2}                 // Passa o estado correto
                        setErrorMessage={setErrorMessage} 
                    />
                )}

                {showModalCadastro && (
                    <AuthModal 
                        setShowModal={setShowModalCadastro} 
                        isSignUp={true} // Para criar conta do candidato
                        setErrorMessage={setErrorMessage} 
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
