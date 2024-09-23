import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmpresaInfo = () => {
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegação

    // Função para obter detalhes da empresa
    async function getCompanyDetails() {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Token não encontrado.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/empresa', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const empresaData = await response.json();
                setEmpresa(empresaData);
            } else {
                setError('Erro ao obter detalhes da empresa');
            }
        } catch (error) {
            setError('Erro na requisição');
        } finally {
            setLoading(false);
        }
    }

    // Função para atualizar informações da empresa
    async function updateCompany(empresaId, updatedData) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8000/update-empresa', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    empresa_id: empresaId,
                    ...updatedData
                })
            });

            if (response.ok) {
                getCompanyDetails();
            } else {
                const errorMessage = await response.text();
                setError('Erro ao atualizar empresa: ' + errorMessage);
            }
        } catch (error) {
            setError('Erro na requisição');
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getCompanyDetails();
        }
    }, []);

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="empresa-info">
            <style>
                {`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    html, body {
                        height: 100%;
                        width: 100%;
                        font-family: Arial, sans-serif;
                    }
                    .empresa-info {
                        height: 100vh; /* Ocupa 100% da altura da tela */
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .empresa-details {
                        margin: 20px 0;
                        max-width: 800px; /* Aumentando a largura máxima */
                        width: 100%; /* Para garantir que não fique muito estreito */
                        background: white;
                        padding: 30px; /* Aumentando o padding */
                        border-radius: 10px; /* Bordas mais arredondadas */
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Sombra mais forte */
                    }
                    .alert {
                        color: red;
                        font-weight: bold;
                    }
                    label {
                        display: block;
                        margin-top: 15px;
                        font-weight: bold;
                        color: #555; /* Cor do texto mais suave */
                    }
                    input, textarea {
                        width: 100%;
                        padding: 12px; /* Aumentando o padding dos campos */
                        margin-top: 5px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        font-size: 16px; /* Aumentando o tamanho da fonte */
                    }
                    button {
                        margin-top: 20px;
                        padding: 12px 20px; /* Aumentando o padding do botão */
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px; /* Aumentando o tamanho da fonte */
                        transition: background-color 0.3s; /* Transição suave */
                    }
                    button:hover {
                        background-color: #45a049;
                    }
                    .loading, .error {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 18px; /* Aumentando o tamanho da fonte */
                    }
                    .error {
                        color: red;
                    }
                `}
            </style>
            <h1>Informações da Empresa</h1>
            {empresa && (
                <div className="empresa-details">
                    <p><strong>Nome:</strong> {empresa.nome_empresa} <span className="alert"> (não pode ser alterado)</span></p>
                    <p><strong>CNPJ:</strong> {empresa.cnpj} <span className="alert"> (não pode ser alterado)</span></p>
                    <p><strong>Endereço:</strong> {empresa.endereco_empresa}</p>
                    <p><strong>Telefone:</strong> {empresa.telefone_empresa}</p>
                    <p><strong>Sobre:</strong> {empresa.about_empresa}</p>
                    
                    <h3>Atualizar Informações</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const updatedData = {
                            endereco_empresa: e.target.endereco.value,
                            telefone_empresa: e.target.telefone.value,
                            about_empresa: e.target.sobre.value
                        };
                        updateCompany(empresa.empresa_id, updatedData);
                    }}>
                        <div>
                            <label htmlFor="endereco">Endereço:</label>
                            <input type="text" id="endereco" defaultValue={empresa.endereco_empresa} required />
                        </div>
                        <div>
                            <label htmlFor="telefone">Telefone:</label>
                            <input type="text" id="telefone" defaultValue={empresa.telefone_empresa} required />
                        </div>
                        <div>
                            <label htmlFor="sobre">Sobre:</label>
                            <textarea id="sobre" defaultValue={empresa.about_empresa} required />
                        </div>
                        <button type="submit">Atualizar</button>
                    </form>

                    {/* Botão para acessar a página de cadastro de vagas */}
                    <button onClick={() => navigate('/onCadasterJob')} style={{ marginTop: '20px' }}>
                        Criar Vaga de Emprego
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmpresaInfo;
