import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Empresas = () => {
    const [empresa, setEmpresa] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['AuthToken']);
    
    useEffect(() => {
        const fetchEmpresa = async () => {
            const token = cookies.AuthToken;

            if (!token) {
                setError('Token não encontrado. Faça login novamente.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/empresa?userId=${token.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmpresa(response.data);
            } catch (error) {
                console.error('Erro ao buscar empresa:', error);
                setError(error.response?.data || 'Erro ao buscar dados da empresa.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmpresa();
    }, [cookies]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div>
            <h2>Informações da Empresa</h2>
            <p>Nome: {empresa.nome_empresa}</p>
            <p>CNPJ: {empresa.cnpj}</p>
            <p>Endereço: {empresa.endereco_empresa}</p>
            <p>Telefone: {empresa.telefone_empresa}</p>
            <p>Sobre: {empresa.about_empresa}</p>
        </div>
    );
};

export default Empresas;
