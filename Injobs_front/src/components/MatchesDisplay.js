import React from 'react'

const matches = [
    { id: 1, name: 'Richard', imageUrl: 'https://i.imgur.com/CKmWtzT.png' },
    { id: 2, name: 'Bob', imageUrl: 'https://i.imgur.com/CKmWtzT.png' },
    { id: 3, name: 'Charlie', imageUrl: 'https://i.imgur.com/CKmWtzT.png' },
    { id: 4, name: 'Dana', imageUrl: 'https://i.imgur.com/CKmWtzT.png' },
    { id: 5, name: 'Eve', imageUrl: 'https://i.imgur.com/CKmWtzT.png' }
]

const MatchesDisplay = ({ setClickedUser }) => {
    return (
        <div className="matches-display">
            {matches.map((match) => (
                <div 
                    key={match.id} 
                    className="match-card"
                    onClick={() => setClickedUser(match)}
                >
                    <img 
                        src={match.imageUrl} 
                        alt={`${match.name}'s profile`} 
                        className="match-image"
                    />
                    <p>{match.name}</p>
                </div>
            ))}
        </div>
    )
}

export default MatchesDisplay
