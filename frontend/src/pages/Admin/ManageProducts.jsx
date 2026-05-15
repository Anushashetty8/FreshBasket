import { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Package,
  ImagePlus,
  FileText,
  Layers,
  DollarSign,
  Percent,
  Calendar,
} from "lucide-react";

const ManageProducts = () => {
  const { axios } = useContext(AuthContext);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("category", category);
      formData.append("taxRate", taxRate);
      formData.append("expiryDate", expiryDate);

      for (let i = 0; i < files.length; i++) {
        if (files[i]) formData.append("image", files[i]);
      }

      const { data } = await axios.post(
        "/api/product/add-product",
        formData
      );

      if (data.success) {
        toast.success(data.message);

        setName("");
        setDescription("");
        setPrice("");
        setOfferPrice("");
        setCategory("");
        setTaxRate("");
        setExpiryDate("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* ================= LEFT FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 md:p-10 space-y-10"
        >

          {/* HEADER */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <Package className="text-indigo-600" size={34} />
              Product Builder
            </h1>
            <p className="text-gray-500 mt-2">
              Create a new product listing for FreshBasket Admin store
            </p>
          </div>

          {/* STEP 1 - IMAGES */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImagePlus size={18} /> Upload Images
            </h2>

            <div className="grid grid-cols-4 gap-3">
              {Array(4).fill("").map((_, i) => (
                <label key={i} className="cursor-pointer">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const updated = [...files];
                      updated[i] = e.target.files[0];
                      setFiles(updated);
                    }}
                  />

                  <div className="aspect-square rounded-2xl border-2 border-dashed hover:border-indigo-500 flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      src={
                        files[i]
                          ? URL.createObjectURL(files[i])
                          : assets.upload_area
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* STEP 2 - BASIC INFO */}
          <section className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-medium flex items-center gap-2">
                <FileText size={16} /> Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="font-medium flex items-center gap-2">
                <Layers size={16} /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border"
              >
                <option value="">Select</option>
                {categories.map((c, i) => (
                  <option key={i} value={c.path}>
                    {c.path}
                  </option>
                ))}
              </select>
            </div>

          </section>

          {/* STEP 3 - DESCRIPTION */}
          <section>
            <label className="font-medium">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border resize-none"
            />
          </section>

          {/* STEP 4 - PRICING GRID */}
          <section className="grid md:grid-cols-3 gap-5">

            <div>
              <label className="flex items-center gap-2 font-medium">
                <Percent size={16} /> Tax
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium">
                <DollarSign size={16} /> Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium">
                <DollarSign size={16} /> Offer
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full mt-2 p-3 rounded-xl border"
              />
            </div>

          </section>

          {/* STEP 5 */}
          <section>
            <label className="flex items-center gap-2 font-medium">
              <Calendar size={16} /> Expiry Date
            </label>

            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border"
            />
          </section>

        </form>

        {/* ================= RIGHT SIDE PREVIEW ================= */}
        <div className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-6">

          <h2 className="text-2xl font-bold mb-4">Live Preview</h2>

          <div className="space-y-3 text-gray-700">

            <p><b>Name:</b> {name || "Product Name"}</p>
            <p><b>Category:</b> {category || "Not selected"}</p>
            <p><b>Price:</b> ₹{price || 0}</p>
            <p><b>Offer:</b> ₹{offerPrice || 0}</p>
            <p><b>Tax:</b> {taxRate || 0}%</p>

          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition"
          >
            PUBLISH PRODUCT
          </button>

        </div>

      </div>
    </div>
  );
};

export default ManageProducts;