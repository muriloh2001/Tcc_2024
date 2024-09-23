import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidatoInfo = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        endereco: '',
        numero: '',
        cidade: '',
        estado: '',
        pais: '',
        telefone: '',
        about: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError("Token não encontrado.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/candidato', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setFormData({
                        endereco: userData.endereco || '',
                        numero: userData.numero || '',
                        cidade: userData.cidade || '',
                        estado: userData.estado || '',
                        pais: userData.pais || '',
                        telefone: userData.telefone || '',
                        about: userData.about || '',
                    });
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Erro ao obter detalhes do usuário');
                }
            } catch (error) {
                setError('Erro na requisição: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8000/candidato', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
                navigate('/dashboard'); // Redireciona para a página de Dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Erro ao atualizar dados');
            }
        } catch (error) {
            setError('Erro na requisição: ' + error.message);
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.container}>
            <h1>Informações do Candidato</h1>
            {user && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.userDetails}>
                        <p><strong>Email:</strong> <input type="email" name="email" value={user.email} readOnly style={styles.input} /></p>
                        <p><strong>Nome:</strong> <input type="text" name="nome" value={user.nome} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>CPF:</strong> {user.cpf} (não editável)</p>
                        <p><strong>Endereço:</strong> <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>Número:</strong> <input type="text" name="numero" value={formData.numero} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>Cidade:</strong> <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>Estado:</strong> <input type="text" name="estado" value={formData.estado} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>País:</strong> <input type="text" name="pais" value={formData.pais} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>Telefone:</strong> <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} disabled={!isEditing} style={styles.input} /></p>
                        <p><strong>Sobre:</strong> <textarea name="about" value={formData.about} onChange={handleChange} disabled={!isEditing} style={styles.textarea} /></p>
                        <p><strong>Matches:</strong> {user.matches}</p>
                    </div>
                    <button type="button" onClick={handleEditToggle} style={styles.button}>
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                    {isEditing && <button type="submit" style={styles.button}>Salvar</button>}
                </form>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    form: {
        marginBottom: '20px',
    },
    userDetails: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
    },
    textarea: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        height: '100px',
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        marginRight: '10px',
    },
};

export default CandidatoInfo;
