import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "../interfaces/Products.interface";

export const UseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false)

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    loading,
    getProducts
  };
};
