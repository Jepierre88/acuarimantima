import LoginForm from "@/components/auth/LoginForm";
import { Card } from "@nextui-org/card";
import Image from "next/image";
import BG from "@/public/AUTH-BG.jpg";
import { UseNavigateContext } from "@/app/context/NavigateContext";

export default function Login() {
    return (
        <section className="m-auto flex justify-center items-center h-full gap-10 relative bg-black/50 backdrop-blur-md">
            <Card className="max-w-xl md:flex hidden items-center">
                <Image src={BG} alt="..." />
                <h1 className="absolute inset-0 flex items-center justify-start font-bold text-4xl mx-3 text-white">
                    Acuarimantima
                </h1>
            </Card>
            <LoginForm />
        </section>
    );
}
