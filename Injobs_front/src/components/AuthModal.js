import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cookies, setCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const handleClick = () => {
        setShowModal(false);
    };

    const validateCPF = (cpf) => {
        const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return regex.test(cpf);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            const response = await axios.post('http://localhost:8000/login', { email, password });
            console.log('Resposta do login:', response.data); // Verifique se o token está aqui
            localStorage.setItem('token', response.data.token); // Armazene o token no localStorage
            navigate('/onboarding');
        } catch (error) {
            setError('Erro ao fazer login: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="auth-modal-cand">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            <h2>{isSignUp ? 'CONTA PERFIL CANDIDATO' : 'LOGIN CANDIDATO'}</h2>
            <p>
                Ao clicar em Login, você concorda com nossos termos. Saiba como processamos os seus dados na nossa Política de Privacidade e Política de Cookies.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                {isSignUp && (
                    <>
                        <input
                            type="text"
                            placeholder="Nome"
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="text"
                            placeholder="CPF"
                            required
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="password"
                            placeholder="Confirme a senha"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                    </>
                )}
                <button type="submit" className="secondary-button" disabled={loading}>
                    {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default AuthModal;
