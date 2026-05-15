import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const Products = () => {
  const { products, fetchProducts, axios } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", {
        id,
        inStock,
      });

      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
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

  // ================= IMAGE FIX =================
  const getImage = (product) => {
    // CASE 1 => array
    if (Array.isArray(product.image) && product.image.length > 0) {
      const img = product.image[0];

      // cloudinary/full url
      if (img.startsWith("http")) return img;

      // local uploads
      return `${import.meta.env.VITE_BACKEND_URL}/images/${img}`;
    }

    // CASE 2 => single string
    if (typeof product.image === "string") {
      if (product.image.startsWith("http")) {
        return product.image;
      }

      return `${import.meta.env.VITE_BACKEND_URL}/images/${product.image}`;
    }

    // fallback image
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 md:p-10">

      {/* HEADER */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-black text-gray-800 tracking-tight">
            Product Hub
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your inventory with full control
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl px-4 py-2 border">
          <p className="text-sm text-gray-500">Total Products</p>

          <p className="text-2xl font-bold text-gray-800">
            {products?.length || 0}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="p-5 text-left">Product</th>
                <th className="p-5 text-left">Category</th>
                <th className="p-5 hidden md:table-cell">Price</th>
                <th className="p-5 text-center">Stock</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {products?.length > 0 ? (
                products.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`border-b last:border-none transition-all duration-200 hover:bg-indigo-50/50 ${
                      index % 2 === 0 ? "bg-white/40" : "bg-white/20"
                    }`}
                  >

                    {/* PRODUCT */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">

                        {/* IMAGE */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md border bg-gray-100">

                          <img
                            src={getImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150";
                            }}
                          />

                        </div>

                        {/* INFO */}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {product._id.slice(-6)}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="p-5 text-gray-600 capitalize">
                      {product.category}
                    </td>

                    {/* PRICE */}
                    <td className="p-5 hidden md:table-cell font-bold text-gray-800">
                      ₹{product.offerPrice?.toLocaleString("en-IN")}
                    </td>

                    {/* STOCK */}
                    <td className="p-5 text-center">

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                          onChange={() =>
                            toggleStock(product._id, !product.inStock)
                          }
                        />

                        <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition"></div>

                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
                      </label>

                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.inStock
                            ? "Available"
                            : "Out of stock"}
                        </span>
                      </div>

                    </td>

                    {/* ACTIONS */}
                    <td className="p-5">

                      <div className="flex justify-center gap-3">

                        {/* EDIT */}
                        <button
                          onClick={() =>
                            navigate(`/seller/edit-product/${product._id}`)
                          }
                          className="p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:scale-110 transition"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 transition"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-16 text-gray-500"
                  >
                    No products found 😕
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default Products;