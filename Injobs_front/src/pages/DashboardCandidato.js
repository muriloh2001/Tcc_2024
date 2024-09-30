import Nav from '../components/Nav';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para redirecionamento

const DashboardCandidato = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redireciona se o usuário não estiver logado
            return;
        }

        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:8000/jobs', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Erro ao buscar vagas');
                }
            } catch (error) {
                setError('Erro ao buscar vagas: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [navigate]);

    if (loading) return <div>Carregando vagas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Nav setShowModal={() => {}} showModal={false} />
            <div className="dashboard-candidato">
                <h2>Vagas Disponíveis</h2>
                <div className="job-list">
                    {jobs.map((job) => (
                        <div key={job.job_id} className="job-item">
                            <h3>{job.titulo}</h3>
                            <p><strong>Empresa:</strong> {job.nome_empresa}</p>
                            <p><strong>Descrição:</strong> {job.descricao}</p>
                            <p><strong>Requisitos:</strong> {job.requisitos}</p>
                            <p><strong>Salário:</strong> {job.salario}</p>
                        </div>
                    ))}
                </div>
            </div>
            
        </>
    );
};

export default DashboardCandidato;
