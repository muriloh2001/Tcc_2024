import Nav from '../components/Nav';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicione esta importação

const OnCadasterJob = () => {
    const [formData, setFormData] = useState({
        job_title: "",
        job_description: "",
        requirements: "",
        benefits: "",
        salary: "",
        work_location: "",
        contract_type: "",
        start_date: "",
        application_deadline: "",
        selection_process: "",
        diversity_policy: "",
        required_documents: ""
    });

    const [isCompany, setIsCompany] = useState(false); // Estado para verificar se o usuário é uma empresa
    const navigate = useNavigate(); // Hook para redirecionamento

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Aqui você pode fazer uma chamada para verificar o tipo de usuário
            // Exemplo fictício:
            const userType = JSON.parse(atob(token.split('.')[1])).role; // Supondo que o payload do token tenha um campo 'role'
            if (userType === 'empresa') {
                setIsCompany(true);
            } else {
                setIsCompany(false);
                navigate('/'); // Redireciona para a página inicial ou outra página adequada
            }
        } else {
            navigate('/login'); // Redireciona para a página de login se não houver token
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <Nav setShowModal={() => {}} showModal={false} />
            <div className="onboarding">
                {isCompany ? (
                    <>
                        <h2>CRIE UMA VAGA DE EMPREGO</h2>
                        <form onSubmit={handleSubmit}>
                            <section>
                                <label htmlFor="job_title">Título da Vaga</label>
                                <input
                                    id="job_title"
                                    type='text'
                                    name="job_title"
                                    placeholder="Nome do cargo a ser preenchido"
                                    required={true}
                                    value={formData.job_title}
                                    onChange={handleChange}
                                />
                                <label htmlFor="job_description">Descrição da Vaga</label>
                                <textarea
                                    id="job_description"
                                    name="job_description"
                                    placeholder="Detalhes sobre as responsabilidades, atividades, e requisitos do cargo"
                                    required={true}
                                    value={formData.job_description}
                                    onChange={handleChange}
                                />
                                <label htmlFor="requirements">Requisitos</label>
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    placeholder="Qualificações necessárias, incluindo educação, experiência, habilidades específicas, e certificações"
                                    required={true}
                                    value={formData.requirements}
                                    onChange={handleChange}
                                />
                                <label htmlFor="benefits">Benefícios</label>
                                <textarea
                                    id="benefits"
                                    name="benefits"
                                    placeholder="Informações sobre os benefícios oferecidos"
                                    required={true}
                                    value={formData.benefits}
                                    onChange={handleChange}
                                />
                                <label htmlFor="salary">Salário</label>
                                <input
                                    id="salary"
                                    type='text'
                                    name="salary"
                                    placeholder="Faixa salarial ou salário específico, se aplicável"
                                    required={true}
                                    value={formData.salary}
                                    onChange={handleChange}
                                />
                                <label htmlFor="work_location">Local de Trabalho</label>
                                <input
                                    id="work_location"
                                    type='text'
                                    name="work_location"
                                    placeholder="Endereço ou cidade onde a vaga está localizada, incluindo a possibilidade de trabalho remoto"
                                    required={true}
                                    value={formData.work_location}
                                    onChange={handleChange}
                                />
                                <label htmlFor="contract_type">Tipo de Contrato</label>
                                <input
                                    id="contract_type"
                                    type='text'
                                    name="contract_type"
                                    placeholder="Especificação do tipo de contrato (CLT, PJ, estágio, temporário, etc.)"
                                    required={true}
                                    value={formData.contract_type}
                                    onChange={handleChange}
                                />
                                <label htmlFor="start_date">Data de Início</label>
                                <input
                                    id="start_date"
                                    type='date'
                                    name="start_date"
                                    required={true}
                                    value={formData.start_date}
                                    onChange={handleChange}
                                />
                                <label htmlFor="application_deadline">Prazo de Candidatura</label>
                                <input
                                    id="application_deadline"
                                    type='date'
                                    name="application_deadline"
                                    required={true}
                                    value={formData.application_deadline}
                                    onChange={handleChange}
                                />
                                <label htmlFor="selection_process">Etapas do Processo Seletivo</label>
                                <textarea
                                    id="selection_process"
                                    name="selection_process"
                                    placeholder="Descrição das etapas do processo seletivo (entrevistas, testes, dinâmicas)"
                                    required={true}
                                    value={formData.selection_process}
                                    onChange={handleChange}
                                />
                                <label htmlFor="diversity_policy">Política de Diversidade e Inclusão</label>
                                <textarea
                                    id="diversity_policy"
                                    name="diversity_policy"
                                    placeholder="Informações sobre políticas de diversidade e inclusão da empresa, se aplicável"
                                    value={formData.diversity_policy}
                                    onChange={handleChange}
                                />
                                <label htmlFor="required_documents">Documentos Necessários</label>
                                <textarea
                                    id="required_documents"
                                    name="required_documents"
                                    placeholder="Documentação que o candidato deve enviar (currículo, carta de apresentação, portfólio, etc.)"
                                    required={true}
                                    value={formData.required_documents}
                                    onChange={handleChange}
                                />
                                <button className='submit-forms' type="submit">SALVAR</button>
                            </section>
                        </form>
                    </>
                ) : (
                    <div>
                        <h2>Acesso Negado</h2>
                        <p>Você não tem permissão para acessar esta página. Apenas empresas podem criar vagas.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default OnCadasterJob;
