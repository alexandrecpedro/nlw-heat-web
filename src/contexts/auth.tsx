import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    // void = no return
    signOut: () => void;
}

type AuthResponse = {
    token: string,
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
    // ReactNode = tudo que é aceitável pelo React 
    children: ReactNode;
}

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=41eb753d9421f9e7a894`;

    // função de signIn ou logIn
    let signIn = async (githubCode: string) => {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        })

        const { token, user } = response.data;

        // armazenar token no histórico do navegador
        localStorage.setItem('@dowhile: token', token);
        // saber se usuário está logado sem precisar dar refresh na página
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        
        setUser(user);
    }

    // função de signOut ou logOut
    let signOut = async () => {
        // definir usuário como null
        setUser(null);
        // remover informações do histórico do navegador
        localStorage.removeItem('@dowhile: token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile: token');
        if (token) {
            // defaults.headers = axios permite que toda requisição vá com o token no cabeçalho
            // verificando o usuário apenas quando se dá um refresh na página
            api.defaults.headers.common.authorization = `Bearer ${token}`;
            // retorno da requisição
            api.get<User>('profile').then(response => {
                setUser(response.data);
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=');
            // remover o código da URL
            window.history.pushState({}, '', urlWithoutCode);
            
            signIn(githubCode);
        }
    }, [])

    return (
        <AuthContext.Provider value={{signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}