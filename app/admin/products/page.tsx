"use client";
import { UseAuthContext } from "@/app/context/AuthContext";
import { UseProducts } from "@/app/hooks/UseProducts";
import { Product } from "@/app/interfaces/Products.interface";
import { Navbar } from "@/components/navbar";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Delete, Edit } from "@nextui-org/shared-icons";
import { Pagination } from "@nextui-org/pagination";

export default function Products() {
    const { products } = UseProducts();

    return (
        <>
            <Navbar />
            <main>
                <Card className="max-w-4xl mx-auto py-5 px-4">
                    <CardBody>
                        <ProductTable />
                    </CardBody>
                </Card>
            </main>
        </>
    );
}

const ProductTable = () => {
    const { products, loading, getProducts } = UseProducts();
    const [search, setSearch] = useState("");
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [editProduct, setEditProduct] = useState<any | undefined>(undefined);

    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    // Filtrar productos
    const filteredProducts = products.filter((product: Product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const pages = Math.ceil(filteredProducts.length / rowsPerPage);

    // Calcular los productos a mostrar según la paginación
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredProducts.slice(start, end);
    }, [page, filteredProducts]);

    // Función para abrir y cerrar el modal
    const handleOpenModalCreate = () => setIsOpenCreate(true);
    const handleCloseModalCreate = () => setIsOpenCreate(false);
    const handleOpenModalUpdate = (product: Product) => {
        setEditProduct(product); // Establece el producto a editar
        setIsOpenUpdate(true); // Abre el modal de editar
    };

    const handleCloseModalUpdate = () => setIsOpenUpdate(false);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Input
                    variant="underlined"
                    placeholder="Buscar producto..."
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Resetear a la primera página al buscar
                    }}
                    value={search}
                    aria-label="Buscar productos"
                    className="w-1/2"
                />
                <Button color="primary" onClick={handleOpenModalCreate}>
                    Agregar Producto
                </Button>
            </div>
            <Table
                aria-label="Productos"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn>Código</TableColumn>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Precio</TableColumn>
                    <TableColumn>Opciones</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner>Loading...</Spinner>}
                >
                    {items.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.value}</TableCell>
                            <TableCell className="flex justify-around items-center">
                                <Button
                                    style={{
                                        minWidth: "40px",
                                        minHeight: "40px",
                                        padding: "0",
                                    }}
                                    aria-label="Editar"
                                    onClick={() =>
                                        handleOpenModalUpdate(product)
                                    }
                                >
                                    <Edit fill="#09f" size={20} />
                                </Button>
                                <Button
                                    style={{
                                        minWidth: "40px",
                                        minHeight: "40px",
                                        padding: "0",
                                    }}
                                    aria-label="Eliminar"
                                >
                                    <Delete fill="red" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CreateProductModal
                isOpen={isOpenCreate}
                setIsOpen={setIsOpenCreate}
                onOpenChange={handleCloseModalCreate}
                getProducts={getProducts}
            />
            <UpdateProductModal
                isOpen={isOpenUpdate}
                setIsOpen={setIsOpenCreate}
                onOpenChange={handleCloseModalUpdate}
                getProducts={getProducts}
                product={editProduct}
            />
        </>
    );
};

const CreateProductModal = ({
    isOpen,
    onOpenChange,
    getProducts,
    setIsOpen,
}: {
    isOpen: boolean;
    onOpenChange: () => void;
    getProducts: () => void;
    setIsOpen: (open: boolean) => void;
}) => {
    const { register, handleSubmit } = useForm();
    const { token } = UseAuthContext();

    const onProductCreate = async (data: any) => {
        try {
            console.log(data);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                {
                    name: data.name,
                    value: parseInt(data.value),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el token Bearer
                    },
                }
            );
            console.log("Data created");
            getProducts();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Agregar producto
                        </ModalHeader>
                        <ModalBody>
                            <form
                                className="flex flex-col gap-3 justify-center items-center"
                                onSubmit={handleSubmit(onProductCreate)}
                            >
                                <Input
                                    label={"Nombre"}
                                    size="sm"
                                    {...register("name", { required: true })}
                                ></Input>
                                <Input
                                    label={"Valor"}
                                    type="number"
                                    size="sm"
                                    {...register("value", { required: true })}
                                ></Input>
                                <div className="flex justify-end w-full">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cerrar
                                    </Button>
                                    <Button color="primary" type="submit">
                                        Crear
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

const UpdateProductModal = ({
    isOpen,
    onOpenChange,
    getProducts,
    setIsOpen,
    product,
}: {
    isOpen: boolean;
    onOpenChange: () => void;
    getProducts: () => void;
    setIsOpen: (open: boolean) => void;
    product: {
        name: string;
        value: number;
        id: number;
    };
}) => {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: product?.name,
            value: product?.value,
            id: product?.id,
        },
    });
    const { token } = UseAuthContext();

    useEffect(() => {
        if (product) {
            setValue("name", product.name);
            setValue("value", product.value);
            setValue("id", product.id);
        }
    }, [product, setValue]);

    const onProductCreate = async (data: any) => {
        try {
            console.log(data);
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`,
                {
                    name: data.name,
                    value: parseInt(data.value),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el token Bearer
                    },
                }
            );
            console.log("Data created");
            getProducts();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Editar producto
                        </ModalHeader>
                        <ModalBody>
                            <form
                                className="flex flex-col gap-3 justify-center items-center"
                                onSubmit={handleSubmit(onProductCreate)}
                            >
                                <Input
                                    label={"Código"}
                                    size="sm"
                                    disabled
                                    {...register("id")}
                                ></Input>
                                <Input
                                    label={"Nombre"}
                                    size="sm"
                                    {...register("name", { required: true })}
                                ></Input>
                                <Input
                                    label={"Valor"}
                                    type="number"
                                    size="sm"
                                    {...register("value", { required: true })}
                                ></Input>
                                <div className="flex justify-end w-full">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cerrar
                                    </Button>
                                    <Button color="primary" type="submit">
                                        Editar
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
