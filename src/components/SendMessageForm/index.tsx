import { FormEvent, useContext, useState } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import { api } from "../../services/api";

import styles from './styles.module.scss';

export function SendMessageForm() {
    // buscar usuário de dentro do contexto | Ativar botão de logOut do usuário
    const { user, signOut } = useContext(AuthContext);
    // armazenar o texto que usuário digita numa variável (começa vazio)
    const [message, setMessage] = useState(''); 

    const handleSendMessage = async (event: FormEvent) => {
        // evitando que o React recarregue a página que já estou (submit de um formulário HTML)
        event.preventDefault();
        // verificar se o texto está vazio
        !message.trim() ? "" : await api.post('messages', { message });
        // limpa o campo assim que o botão enviar for pressionado
        setMessage('');
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea 
                    name="message"
                    id="message"
                    placeholder="Qual sua expectativa para o evento?"
                    // pegando o valor digitado na textarea e atribuindo à variável 'message'
                    onChange={event => setMessage(event.target.value)}
                    // caso a variável 'message' seja preenchida não só com a digitação
                    value={message}
                />

                <button type="submit">Enviar mensagem</button>
            </form>
        </div>
    )
}