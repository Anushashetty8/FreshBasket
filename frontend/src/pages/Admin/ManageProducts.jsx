import { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const { axios } = useContext(AuthContext);

  // STATES
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // EDIT FUNCTION
  const handleEdit = (product) => {
    setIsEdit(true);
    setEditId(product._id);

    setName(product.name || "");
    setDescription(product.description?.join('\n') || "");
    setPrice(product.price || "");
    setOfferPrice(product.offerPrice || "");
    setCategory(product.category || "");
    setTaxRate(product.taxRate || "");

    setExpiryDate(
      product.expiryDate
        ? product.expiryDate.split("T")[0]
        : ""
    );

    setFiles([]);
  };

  // SUBMIT FUNCTION
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

      // MULTIPLE IMAGES
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("image", files[i]);
        }
      }

      let response;

      // UPDATE PRODUCT
      if (isEdit) {
        response = await axios.put(
          `/api/product/update/${editId}`,
          formData
        );
      }

      // ADD PRODUCT
      else {
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
        setTaxRate("");
        setExpiryDate("");
        setFiles([]);

        setIsEdit(false);
        setEditId(null);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >

        {/* PRODUCT IMAGES */}
        <div>
          <p className="text-base font-medium">
            Product Images
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id={`image${index}`}
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] =
                        e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                  />

                  <img
                    className="w-24 h-24 object-cover border cursor-pointer rounded"
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

        {/* PRODUCT NAME */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
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
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
          />
        </div>

        {/* CATEGORY */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((cat, index) => (
              <option
                key={index}
                value={cat.path}
              >
                {cat.path}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE SECTION */}
        <div className="flex items-center gap-5 flex-wrap">

          {/* TAX */}
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">
              Tax (%)
            </label>

            <input
              type="number"
              value={taxRate}
              onChange={(e) =>
                setTaxRate(e.target.value)
              }
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
              onChange={(e) =>
                setPrice(e.target.value)
              }
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
              onChange={(e) =>
                setOfferPrice(e.target.value)
              }
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        {/* EXPIRY DATE */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">
            Expiry Date
          </label>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) =>
              setExpiryDate(e.target.value)
            }
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          />
        </div>

        {/* BUTTON */}
        <button className="px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 transition text-white font-medium rounded">
          {isEdit ? "UPDATE" : "ADD"}
        </button>

      </form>
    </div>
  );
};

export default ManageProducts;