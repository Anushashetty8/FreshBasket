import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Products = () => {
const {products,fetchProducts,axios} = useContext(AuthContext);
const navigate = useNavigate();

const toggleStock = async(id,inStock) =>{
    try{
        const{data} = await axios.post("/api/product/stock",{id, inStock});
        if(data.success){
            fetchProducts();
            toast.success(data.message);
        }else{
            toast.error(data.message);
        }
    }catch(error){
        toast.error(error.message);
    }
};

const deleteProduct = async (id) => {
    try {
        const { data } = await axios.delete(`/api/product/${id}`);
        if (data.success) {
            fetchProducts();
            toast.success("Product deleted successfully");
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

return (
    <div className="flex-1 py-10 flex flex-col justify-between">
        <div className="w-full md:p-10 p-4">
            <h2 className="pb-4 text-lg font-medium">All Products</h2>

            <div className="max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                <table className="table-auto w-full">
                    
                    <thead className="text-gray-900 text-sm text-left">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3 hidden md:table-cell">Selling Price</th>
                            <th className="px-4 py-3 text-center">In Stock</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm text-gray-500">
                        {products.map((product) => (
                            <tr key={product._id} className="border-t h-20">
                                
                                {/* PRODUCT */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 border rounded overflow-hidden">
                                            <img 
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/${product.image[0]}`} 
                                                alt="Product" 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="truncate">{product.name}</span>
                                    </div>
                                </td>

                                {/* CATEGORY */}
                                <td className="px-4 py-3">{product.category}</td>

                                {/* PRICE */}
                                <td className="px-4 py-3 hidden md:table-cell">
                                    ₹{product.offerPrice.toLocaleString("en-IN")}
                                </td>

                                {/* STOCK */}
                                <td className="px-4 py-3 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={product.inStock}
                                            onChange={() => toggleStock(product._id, !product.inStock)}
                                        />
                                        <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600"></div>
                                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                                    </label>
                                </td>

                                {/* ACTION */}
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    </div>
);
};

export default Products;