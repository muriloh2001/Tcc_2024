import React, { useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import ChatContainer from '../components/ChatContainer';
import Nav from '../components/Nav';
import { FaCheck, FaXmark, FaRotateLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const db = [
    {
        name: 'Richard Hendricks',
        url: 'https://i.imgur.com/jfQLzd3.png',
        formation: 'Analista de Dados',
        nasc: '06/05/1999',
        Nacionalidade: 'Curitiba, Paraná, Brasil',
        linkedin: 'https://linkedin.com/in/richard-hendricks', // Adicione links reais
        habilidade: 'C#'
    },
    {
        name: 'Julia Bachman',
        url: 'https://i.imgur.com/PoT1cHi.png',
        formation: 'Analista de Dados',
        nasc: '06/05/1999',
        linkedin: 'https://linkedin.com/in/julia-bachman', // Adicione links reais
        habilidade: 'C# - NodeJS, Java, HTML, CSS, React'
    },
    {
        name: 'Monica Hall',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados',
        nasc: '06/05/1999',
        linkedin: 'https://linkedin.com/in/monica-hall', // Adicione links reais
        habilidade: ''
    },
    {
        name: 'Bruna Dunn',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados',
        nasc: '06/05/1999',
        linkedin: 'https://linkedin.com/in/bruna-dunn', // Adicione links reais
        habilidade: 'C#'
    },
    {
        name: 'Dinesh Chugtai',
        url: 'https://i.imgur.com/CKmWtzT.png',
        formation: 'Analista de Dados',
        nasc: '06/05/1999',
        linkedin: 'https://linkedin.com/in/dinesh-chugtai', // Adicione links reais
        habilidade: 'C#'
    }
];

function Dashboard() {
    const characters = db;
    const [lastDirection, setLastDirection] = useState();
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(db.length - 1);
    
    const navigate = useNavigate();

    const canGoBack = currentIndex < db.length - 1;
    const canSwipe = currentIndex >= 0;

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val);
    };

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < db.length) {
            await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
        }
    };

    const currentIndexRef = useRef(currentIndex);

    const childRefs = useMemo(
        () => Array(db.length).fill(0).map(() => React.createRef()),
        []
    );

    const goBack = async () => {
        if (!canGoBack) return;
        const newIndex = currentIndex + 1;
        updateCurrentIndex(newIndex);
        await childRefs[newIndex].current.restoreCard();
    };

    const swiped = (direction, nameToDelete) => {
        console.log('removendo: ' + nameToDelete);
        setLastDirection(direction);
    };

    const outOfFrame = (name) => {
        console.log(name + ' saiu da tela!');
    };

    const openModal = (character) => {
        setSelectedCharacter(character);
    };

    const closeModal = () => {
        setSelectedCharacter(null);
    };

    return (
        <div>
            <Nav setShowModal={() => { }} showModal={false} />
            <div className='dashboard'>
                <ChatContainer user={{ matches: db }} />
                <div className='swipe-container'>
                    <div className='card-container'>
                        {characters.map((character) => (
                            <TinderCard
                                className='swipe'
                                key={character.name}
                                onSwipe={(dir) => swiped(dir, character.name)}
                                onCardLeftScreen={() => outOfFrame(character.name)}
                            >
                                <div
                                    style={{ backgroundImage: 'url(' + character.url + ')' }}
                                    className='card'
                                    onDoubleClick={() => openModal(character)}
                                >
                                    <div className='cardContent'>
                                        <h3>{character.name}</h3>
                                        <div className='card-formation'>
                                            <p>{character.formation}</p>
                                        </div>
                                    </div>
                                </div>
                            </TinderCard>
                        ))}
                    </div>
                    <div className='buttons-swipe'>
                        <button 
                            className='buttons-swipe-dislike' 
                            style={{ backgroundColor: !canSwipe && '#c3c4d3' }} 
                            onClick={() => swipe('left')}
                        >
                            <FaXmark />
                        </button>
                        <button 
                            className='buttons-swipe-undo' 
                            style={{ backgroundColor: !canGoBack && '#c3c4d3' }} 
                            onClick={goBack}
                        >
                            <FaRotateLeft />
                        </button>
                        <button 
                            className='buttons-swipe-like' 
                            style={{ backgroundColor: !canSwipe && '#c3c4d3' }} 
                            onClick={() => swipe('right')}
                        >
                            <FaCheck />
                        </button>
                    </div>
                </div>
            </div>

            {selectedCharacter && (
                <div className='modal'>
                    <div className='modal-content'>
                        <span className='close' onClick={closeModal}>&times;</span>
                        <h2>{selectedCharacter.name}</h2>
                        <img src={selectedCharacter.url} alt={"foto de " + selectedCharacter.name} />
                        <p><strong>Formação:</strong> {selectedCharacter.formation}</p>
                        <p><strong>Data de Nascimento:</strong> {selectedCharacter.nasc}</p>
                        <p><strong>LinkedIn:</strong> <a href={selectedCharacter.linkedin} target="_blank" rel="noopener noreferrer">{selectedCharacter.linkedin}</a></p>
                        <p><strong>Habilidades:</strong> {selectedCharacter.habilidade || 'Nenhuma habilidade especificada'}</p>

                        {/* Botão para editar o perfil */}
                        <button onClick={() => {
                            closeModal(); // Fecha o modal antes de navegar
                            navigate(`/onboardingEmpresa?name=${selectedCharacter.name}`);
                        }}>
                            Editar Perfil
                        </button>

                        {/* Botão para ir ao Onboarding */}
                        <button onClick={() => {
                            closeModal(); // Fecha o modal antes de navegar
                            navigate('/onboardingEmpresa');
                        }}>
                            Ir para Onboarding
                        </button>

                        {/* Botão para ver mais detalhes */}
                        <button onClick={() => console.log(`Ver mais sobre ${selectedCharacter.name}`)}>
                            Ver Mais
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
