import { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const { axios } = useContext(AuthContext);

  // ✅ STATES
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  //  EDIT FUNCTION
  const handleEdit = (product) => {
    setIsEdit(true);
    setEditId(product._id);

    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setOfferPrice(product.offerPrice);
    setCategory(product.category);
    setTaxRate(product.taxRate);

    setFiles([]); // optional
  };

  //  SUBMIT FUNCTION (ADD + UPDATE)
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("category", category);
      formData.append("taxRate", taxRate);

      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("images", files[i]); 
        }
      }

      let response;

      if (isEdit) {
        //  UPDATE API
        response = await axios.put(
          `/api/product/update/${editId}`,
          formData
        );
      } else {
        // EXISTING ADD API
        response = await axios.post(
          "/api/product/add-product",
          formData
        );
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message);

        // RESET FORM
        setName("");
        setDescription("");
        setPrice("");
        setOfferPrice("");
        setCategory("");
        setFiles([]);
        setTaxRate("");

        setIsEdit(false);
        setEditId(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* IMAGE */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="w-24 h-24 object-cover cursor-pointer border"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="upload"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* NAME */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Product Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          />
        </div>

        {/* CATEGORY */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.path}>
                {cat.path}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE SECTION */}
        <div className="flex items-center gap-5 flex-wrap">

          {/* TAX */}
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Tax (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="5"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          {/* PRICE */}
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">
              Product Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          {/* OFFER PRICE */}
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">
              Offer Price
            </label>
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        {/* BUTTON */}
        <button className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded">
          {isEdit ? "UPDATE" : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default ManageProducts;