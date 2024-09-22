import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, ubuntu } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { NavigateProvider } from "./context/NavigateContext";
import { AuthProvider } from "./context/AuthContext";
import validateLogin from "./utils/validateLogin";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    "min-h-screen bg-background font-sans antialiased",
                    ubuntu.className
                )}
            >
                <Providers
                    themeProps={{ attribute: "class", defaultTheme: "dark" }}
                >
                    <NavigateProvider>
                        <AuthProvider>
                            <div className="relative flex flex-col h-screen">
                                {children}
                            </div>
                        </AuthProvider>
                    </NavigateProvider>
                </Providers>
            </body>
        </html>
    );
}
