"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { UserCredentials } from "../interfaces/Auth.interface";
import { useRouter } from "next/navigation";

interface AuthContextType {
    token: string;
    signIn: (credentials: UserCredentials) => Promise<void>;
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UseAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("No AuthContext provided");
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const signIn = async (credentials: UserCredentials) => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
            credentials
        );
        setToken(response.data.token);
        window.localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
    };

    const router = useRouter();

    useEffect(() => {
        if (!token || !isAuthenticated) {
            setIsAuthenticated(false);
            router.push("/auth/login");
        }
    }, [token, router]);

    return (
        <AuthContext.Provider
            value={{
                token: token,
                signIn: signIn,
                isAuthenticated: isAuthenticated,
                setIsAuthenticated: setIsAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
