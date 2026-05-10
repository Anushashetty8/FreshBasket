import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard";

const ProductList = () => {

    const { products, searchQuery } = useContext(AuthContext);

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {

        if (products && Array.isArray(products)) {

            let updatedProducts = [...products];

            // SEARCH FILTER
            if (searchQuery.length > 0) {
                updatedProducts = updatedProducts.filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
            }

            // REMOVE EXPIRED PRODUCTS
            updatedProducts = updatedProducts.filter((product) => {

                if (!product.expiryDate) return true;

                const today = new Date();

                const expiry = new Date(product.expiryDate);

                return expiry >= today;
            });

            setFilteredProducts(updatedProducts);
        }

    }, [products, searchQuery]);

    return (
        <div className="mt-16">

            <h1 className="text-3xl lg:text-4xl font-medium">
                All Products
            </h1>

            <div
                className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-start justify-center"
            >

                {filteredProducts
                    .filter((product) => product.inStock)
                    .map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                        />
                    ))}

            </div>
        </div>
    );
};

export default ProductList;