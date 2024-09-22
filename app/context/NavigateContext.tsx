"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import React from "react";

interface NavigateContextType {
    router: AppRouterInstance;
}

const NavigateContext = createContext<NavigateContextType | undefined>(
    undefined
);

export const UseNavigateContext = () => {
    const context = useContext(NavigateContext);
    if (!context) throw new Error("No NavigateContext provided");
    return context;
};

export const NavigateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const router: AppRouterInstance = useRouter();
    return (
        <NavigateContext.Provider
            value={{
                router: router,
            }}
        >
            {children}
        </NavigateContext.Provider>
    );
};
