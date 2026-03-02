import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "./ProductCard";
const ProductCategory = () => {
  const { products, navigate } = useContext(AuthContext);
  const { category } = useParams();
  console.log("category URL:", category);
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()

  );

const filteredProducts = products.filter((product) => {
  return (
    product.category &&
    product.category.toLowerCase() ===
      category?.toLowerCase()
  );
});

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <h1 className="text-3xl md:4xl font-medium">{searchCategory.text.toUpperCase()}</h1>
        </div>
      )}     
      {filteredProducts.length>0 ? (
        <div>
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
          lg:grid-cols-5 gap-4 items-center justify-center">
            {
              filteredProducts.map((product,index)=>(
                <ProductCard key={index} product={product}/>
              ))
            }
          </div>
      </div>
  ):(
    <div>
<h1 className="text-3xl md:text-4xl font-medium">
  No products found
</h1>
  
  </div>
  )}
  </div>
);
};
export default ProductCategory;