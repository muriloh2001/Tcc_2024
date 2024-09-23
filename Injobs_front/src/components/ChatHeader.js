import { useCookies } from 'react-cookie'

const db = [
    {
        name: 'Richard Hendricks',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    },
    {
        name: 'Erlich Bachman',
        url: 'https://i.imgur.com/jfQLzd3.png',
        formation: 'Analista de Dados'
    },
    {
        name: 'Monica Hall',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    },
    {
        name: 'Jared Dunn',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    },
    {
        name: 'Dinesh Chugtai',
        url: 'https://i.imgur.com/9kugbS1.jpeg',
        formation: 'Analista de Dados'
    }
]

const ChatHeader = () => {
   const user = db;
//     const [ cookies,  removeCookie ] = useCookies(['user'])

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user[0].url} alt={"photo of " + user[0].name}/>
                </div>
                <h3>{user[0].name}</h3>
            </div>
        </div>
    )
}

export default ChatHeader;