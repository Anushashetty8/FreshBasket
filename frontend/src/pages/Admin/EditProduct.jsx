import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, fetchProducts } = useContext(AuthContext);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "",
    taxRate: "",
    stock: "",
    expiryDate: "",
    image: null,
  });

  // GET PRODUCT DETAILS
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/${id}`);

      if (data.success) {
        setProduct({
          ...data.product,
          image: null,
        });
      }
    } catch (error) {
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE CHANGE
  const handleImage = (e) => {
    setProduct({
      ...product,
      image: e.target.files[0],
    });
  };

  // UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("offerPrice", product.offerPrice);
      formData.append("category", product.category);
      formData.append("taxRate", product.taxRate);
      formData.append("stock", product.stock);
      formData.append("expiryDate", product.expiryDate);

      if (product.image) {
        formData.append("image", product.image);
      }

      const { data } = await axios.put(
        `/api/product/update/${id}`,
        formData
      );

      if (data.success) {
        toast.success("Product updated successfully");
        fetchProducts();
        navigate("/seller/product-list");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-5">
        Edit Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        {/* Product Name */}
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-3 rounded"
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-3 rounded"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-3 rounded"
        />

        {/* Offer Price */}
        <input
          type="number"
          name="offerPrice"
          value={product.offerPrice}
          onChange={handleChange}
          placeholder="Offer Price"
          className="border p-3 rounded"
        />

        {/* Category */}
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-3 rounded"
        />

        {/* Tax */}
        <input
          type="number"
          name="taxRate"
          value={product.taxRate}
          onChange={handleChange}
          placeholder="Tax %"
          className="border p-3 rounded"
        />

        {/* Stock */}
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border p-3 rounded"
        />

        {/* Expiry Date */}
        <input
          type="date"
          name="expiryDate"
          value={product.expiryDate?.split("T")[0] || ""}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        {/* Image */}
        <input
          type="file"
          onChange={handleImage}
          className="border p-3 rounded"
        />

        {/* Button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded font-medium">
          Update Product
        </button>

      </form>
    </div>
  );
};

export default EditProduct;