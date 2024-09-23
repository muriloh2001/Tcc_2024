import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthModalEmpresa = ({ onClose, isSignUp, setErrorMessage }) => {
    const [cnpj, setCnpj] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nome_empresa, setNomeEmpresa] = useState('');
    const [endereco_empresa, setEnderecoEmpresa] = useState('');
    const [telefone_empresa, setTelefoneEmpresa] = useState('');
    const [about_empresa, setAboutEmpresa] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para navegação

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorMessage('');
    
        if (isSignUp && password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }
    
        // Ajuste os dados a serem enviados
        const data = isSignUp
            ? { 
                cnpj: cnpj, 
                password: password, 
                nome_empresa: nome_empresa, 
                endereco_empresa: endereco_empresa, 
                telefone_empresa: telefone_empresa, 
                about_empresa: about_empresa 
              }
            : { cnpj, password };
    
        try {
            const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup-empresa' : 'login-empresa'}`, data);
            console.log(isSignUp ? 'Empresa cadastrada:' : 'Login bem-sucedido:', response.data);
    
            if (isSignUp) {
                navigate('/onboardingEmpresa');
            } else {
                localStorage.setItem('token', response.data.token);
                navigate('/onboardingEmpresa');
            }
            onClose();
        } catch (err) {
            console.error("Erro na requisição:", err);
            setError(err.response?.data || 'Erro na requisição');
            setErrorMessage(err.response?.data || 'Erro ao realizar a ação');
        }
    };
    
    
    
    

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{isSignUp ? 'Cadastro de Empresa' : 'Login de Empresa'}</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>CNPJ:</label>
                        <input
                            type="text"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            required
                        />
                    </div>
                    {isSignUp && (
                        <>
                            <div>
                                <label>Nome da Empresa:</label>
                                <input
                                    type="text"
                                    value={nome_empresa}
                                    onChange={(e) => setNomeEmpresa(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Endereço:</label>
                                <input
                                    type="text"
                                    value={endereco_empresa}
                                    onChange={(e) => setEnderecoEmpresa(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Telefone:</label>
                                <input
                                    type="text"
                                    value={telefone_empresa}
                                    onChange={(e) => setTelefoneEmpresa(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Sobre:</label>
                                <textarea
                                    value={about_empresa}
                                    onChange={(e) => setAboutEmpresa(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {isSignUp && (
                        <div>
                            <label>Confirme a Senha:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">{isSignUp ? 'Cadastrar' : 'Entrar'}</button>
                </form>
            </div>
        </div>
    );
};

export default AuthModalEmpresa;
