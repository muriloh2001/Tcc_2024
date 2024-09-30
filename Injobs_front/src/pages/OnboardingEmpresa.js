import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmpresaInfo = () => {
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // Mensagem de sucesso
    const navigate = useNavigate(); // Hook de navegação

    // Função para obter os detalhes da empresa
    const getCompanyDetails = async () => {
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
                // Redireciona para o dashboard se a empresa já existir
                if (empresaData) {
                    navigate('/dashboard');
                }
            } else {
                setError('Erro ao obter detalhes da empresa');
            }
        } catch (error) {
            setError('Erro na requisição');
        } finally {
            setLoading(false);
        }
    };

    // Função para criar a empresa
    const createCompany = async (newEmpresaData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8000/create-empresa', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEmpresaData)
            });

            if (response.ok) {
                const empresaCriada = await response.json();
                setEmpresa(empresaCriada); // Armazena os detalhes da empresa criada
                setSuccessMessage('Empresa criada com sucesso!'); // Mensagem de sucesso
                navigate('/dashboard'); // Redireciona para o dashboard após a criação
            } else {
                const errorMessage = await response.text();
                setError('Erro ao criar empresa: ' + errorMessage);
            }
        } catch (error) {
            setError('Erro na requisição');
        }
    };

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
            <h1>Cadastro de Empresa</h1>
            {!empresa && ( // Só exibe o formulário se a empresa não estiver cadastrada
                <div className="empresa-details">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const newEmpresaData = {
                            nome_empresa: e.target.nome_empresa.value,
                            cnpj: e.target.cnpj.value,
                            endereco_empresa: e.target.endereco_empresa.value,
                            telefone_empresa: e.target.telefone_empresa.value,
                            about_empresa: e.target.about_empresa.value,
                        };

                        createCompany(newEmpresaData); // Chama a função para criar empresa
                    }}>
                        <div>
                            <label htmlFor="nome_empresa">Nome da Empresa:</label>
                            <input type="text" id="nome_empresa" name="nome_empresa" required />
                        </div>
                        <div>
                            <label htmlFor="cnpj">CNPJ:</label>
                            <input type="text" id="cnpj" name="cnpj" required />
                        </div>
                        <div>
                            <label htmlFor="endereco_empresa">Endereço:</label>
                            <input type="text" id="endereco_empresa" name="endereco_empresa" required />
                        </div>
                        <div>
                            <label htmlFor="telefone_empresa">Telefone:</label>
                            <input type="text" id="telefone_empresa" name="telefone_empresa" required />
                        </div>
                        <div>
                            <label htmlFor="about_empresa">Sobre a Empresa:</label>
                            <textarea id="about_empresa" name="about_empresa" required />
                        </div>
                        <button type="submit">Cadastrar Empresa</button>
                    </form>

                    {successMessage && <div className="success">{successMessage}</div>} {/* Mensagem de sucesso */}
                </div>
            )}
        </div>
    );
};

export default EmpresaInfo;
