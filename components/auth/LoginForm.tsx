"use client";
import { UseAuthContext } from "@/app/context/AuthContext";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import { UseNavigateContext } from "@/app/context/NavigateContext";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const { register, handleSubmit } = useForm();
    const { signIn } = UseAuthContext();
    const { router } = UseNavigateContext();
    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await signIn(data);
            router.push("/admin");
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="min-w-80">
            <CardHeader>
                <h2 className="flex justify-center w-full text-2xl">
                    Identificate
                </h2>
            </CardHeader>
            <CardBody>
                <form
                    className="flex flex-col items-center justify-center
                 gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        label={"Usuario"}
                        variant="bordered"
                        size="md"
                        {...register("email", { required: true })}
                    />
                    <Input
                        label="Contraseña"
                        variant="bordered"
                        {...register("password", { required: true })}
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                                aria-label="toggle password visibility"
                            >
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        className="max-w-xs"
                    />
                    <Button
                        size="lg"
                        color="primary"
                        type="submit"
                        isLoading={loading}
                    >
                        Ingresar
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}
