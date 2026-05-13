import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
    setCartItems,
  } = useContext(AuthContext);

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  // GET CART PRODUCTS
  const getCart = () => {
    let tempArray = [];

    for (const key in cartItems) {
      const product = products.find((p) => p._id === key);

      if (product) {
        tempArray.push({
          ...product,
          quantity: cartItems[key],
        });
      }
    }

    setCartArray(tempArray);
  };

  // GET ADDRESS
  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");

      if (data.success) {
        setAddress(data.addresses);

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  // PLACE ORDER
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select address");
      }

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);

          setCartItems({});

          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // TAX
  const totalTax = cartArray.reduce((acc, product) => {
    const itemTotal = product.offerPrice * product.quantity;

    return acc + (itemTotal * (product.taxRate || 0)) / 100;
  }, 0);

  const grandTotal = totalCartAmount() + totalTax;

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-12 px-4 md:px-10">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE */}
        <div className="flex-1">

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Shopping Cart
            </h1>

            <p className="text-indigo-600 font-semibold text-lg">
              {cartCount()} Items
            </p>
          </div>

          {/* PRODUCTS */}
          <div className="space-y-6">

            {cartArray.map((product, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl transition duration-300"
              >

                {/* IMAGE */}
                <div
                  onClick={() => {
                    navigate(`/product/${product.category}/${product._id}`);
                    scrollTo(0, 0);
                  }}
                  className="w-40 h-40 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={`http://localhost:5000/images/${product.image[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1 w-full">

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {product.name}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        Weight : {product.weight || "N/A"}
                      </p>

                      <p className="text-gray-500">
                        Tax : {product.taxRate || 0}%
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-3xl font-bold text-indigo-600">
                        ₹
                        {(
                          product.offerPrice * product.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* QUANTITY + REMOVE */}
                  <div className="flex items-center justify-between mt-6">

                    <div className="flex items-center gap-3">

                      <p className="font-medium text-gray-700">
                        Quantity
                      </p>

                      <select
                        value={cartItems[product._id]}
                        onChange={(e) =>
                          updateCartItem(
                            product._id,
                            Number(e.target.value)
                          )
                        }
                        className="border border-gray-300 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {Array(
                          cartItems[product._id] > 9
                            ? cartItems[product._id]
                            : 9
                        )
                          .fill("")
                          .map((_, index) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-500 px-5 py-2 rounded-xl font-medium transition"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CONTINUE SHOPPING */}
          <button
            onClick={() => navigate("/productList")}
            className="mt-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-6 py-3 rounded-2xl transition"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[380px]">

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 sticky top-24">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            {/* ADDRESS */}
            <div className="mb-6">

              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-700">
                  Delivery Address
                </p>

                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-indigo-500 font-medium"
                >
                  Change
                </button>
              </div>

              <div className="mt-3 bg-gray-100 p-4 rounded-2xl text-sm text-gray-600">
                {selectedAddress
                  ? `${selectedAddress.street},
                  ${selectedAddress.city},
                  ${selectedAddress.state},
                  ${selectedAddress.country}`
                  : "No address found"}
              </div>

              {/* ADDRESS DROPDOWN */}
              {showAddress && (

                <div className="mt-3 border rounded-2xl overflow-hidden">

                  {address.map((address, index) => (

                    <div
                      key={index}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddress(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-gray-100 text-sm"
                    >
                      {address.street}, {address.city},
                      {address.state}, {address.country}
                    </div>
                  ))}

                  <div
                    onClick={() => navigate("/add-address")}
                    className="p-3 text-center text-indigo-600 cursor-pointer hover:bg-indigo-50"
                  >
                    + Add Address
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT */}
            <div className="mb-6">

              <p className="font-semibold text-gray-700 mb-2">
                Payment Method
              </p>

              <select
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="COD">
                  Cash On Delivery
                </option>

                <option value="Online">
                  Online Payment
                </option>
              </select>
            </div>

            {/* PRICE DETAILS */}
            <div className="space-y-4 border-t pt-6">

              <div className="flex justify-between text-gray-600">
                <p>Subtotal</p>

                <p>
                  ₹{totalCartAmount().toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex justify-between text-gray-600">
                <p>Shipping</p>

                <p className="text-green-600 font-semibold">
                  Free
                </p>
              </div>

              <div className="flex justify-between text-gray-600">
                <p>Total Tax</p>

                <p>
                  ₹{totalTax.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex justify-between text-2xl font-bold text-gray-800 border-t pt-4">
                <p>Total</p>

                <p>
                  ₹{grandTotal.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* PLACE ORDER */}
            <button
              onClick={placeOrder}
              className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition duration-300 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
            >
              {paymentOption === "COD"
                ? "Place Order"
                : "Proceed to Checkout"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;