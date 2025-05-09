import React, { useState } from "react";
import {
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle,
  HiPlus,
  HiMinus,
  HiOutlineTrash,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const successPageRoute = "/confirm";

  // Product data - in a real app, this would come from a cart context or API  const location = useLocation();
  const designData = location.state?.designData;
  
  // Initialize selectedItems from either designData or defaults
  const [selectedItems, setSelectedItems] = useState(() => {
    if (designData?.furniture) {
      return designData.furniture.map(item => ({
        id: item.id,
        name: item.type,
        description: `Custom ${item.type}`,
        image: item.image,
        price: item.price,
        quantity: 1,
        color: item.color,
        dimensions: `${item.dimensions.width}"W x ${item.dimensions.depth}"D x ${item.dimensions.height}"H`,
      }));
    }
    return [
      {
        id: 1,
        name: "Modern Ergonomic Chair",
        description: "Comfortable office chair with lumbar support",
        image:
          "https://www.vigfurniture.com/media/catalog/product/cache/6d4faa98f2b48c05dae02148ead85f2f/7/8/78736_1.jpg",
        price: 54999,
        quantity: 1,
        color: "Gray",
        dimensions: '24"W x 26"D x 40"H',
      },
      {
        id: 2,
        name: "Solid Oak Dining Table",
        description: "Handcrafted dining table with natural finish",
        image:
          "https://masterplankuk.com/cdn/shop/files/Chunky_Solid_Oak_Dining_Table_and_Bench_set_ebony.png?v=1738927003&width=640",
        price: 199999,
        quantity: 1,
        color: "Natural Oak",
        dimensions: '72"L x 36"W x 30"H',
      },
      {
        id: 3,
        name: "Designer Side Table",
        description: "Minimalist side table with tempered glass top",
        image: "https://edge.thesofaandchair.co.uk/23/158208/2.jpg",
        price: 32999,
        quantity: 2,
        color: "Black/Glass",
        dimensions: '18"Dia x 22"H',
      },
    ];
  });

  // Form and UI state
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoAlert, setPromoAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data and validation
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  // Price calculations
  const subtotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 300000 ? 0 : 9999;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + tax + shipping - discount;

  // Format price to LKR currency
  const formatLKR = (price) => {
    return (
      "LKR " +
      price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  // Handle promo code application
  const handleApplyPromo = () => {
    const validPromoCode = "design10";

    if (promoCode.toLowerCase() === validPromoCode) {
      setPromoApplied(true);
      setPromoAlert({
        show: true,
        message:
          "Promo code 'DESIGN10' applied successfully! You received 10% discount.",
        type: "success",
      });
      toast.success("Promo code applied successfully!");
    } else {
      setPromoAlert({
        show: true,
        message: "Invalid promo code. Please try again.",
        type: "error",
      });
      toast.error("Invalid promo code");
    }
  };

  // Close promo alert
  const closePromoAlert = () => {
    setPromoAlert({ ...promoAlert, show: false });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const cardNumberRegex = /^\d{16}$/;
    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Payment method validation
    if (paymentMethod === "card") {
      if (!formData.cardName.trim())
        newErrors.cardName = "Name on card is required";
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (
        !cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))
      ) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      if (!formData.expDate.trim()) {
        newErrors.expDate = "Expiration date is required";
      } else if (!expDateRegex.test(formData.expDate)) {
        newErrors.expDate = "Format must be MM/YY";
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!cvvRegex.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call - in a real app, this would be an actual API request
      setTimeout(() => {
        toast.success("Order placed successfully!");
        setIsSubmitting(false);
        navigate(successPageRoute);
      }, 1500);
    } else {
      toast.error("Please check the form for errors");
    }
  };

  // Input field with error handling
  const FormInput = ({
    type,
    id,
    name,
    value,
    onChange,
    label,
    placeholder,
    error,
    className = "",
  }) => (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <HiOutlineShoppingCart className="mr-2 text-blue-600" />
                Your Selected Furniture
              </h3>

              {selectedItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => window.history.back()}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row border-b pb-6"
                    >
                      <div className="sm:w-1/4 mb-4 sm:mb-0">
                        <div className="bg-gray-100 rounded-lg p-2 h-32 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="sm:w-3/4 sm:pl-6 flex flex-col">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-lg">{item.name}</h4>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>

                        <div className="text-sm text-gray-500 mb-3">
                          <span className="inline-block mr-4">
                            Color: {item.color}
                          </span>
                          <span className="inline-block">
                            Dimensions: {item.dimensions}
                          </span>
                        </div>

                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                            >
                              <HiMinus size={16} />
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              <HiPlus size={16} />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {formatLKR(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatLKR(item.price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Shipping Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.fullName}
                  className="col-span-2"
                />

                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  label="Email Address"
                  placeholder="john@example.com"
                  error={errors.email}
                  className="col-span-2"
                />

                <FormInput
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  label="Street Address"
                  placeholder="123 Main St"
                  error={errors.address}
                  className="col-span-2"
                />

                <FormInput
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  label="City"
                  placeholder="Colombo"
                  error={errors.city}
                />

                <FormInput
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  label="Postal Code"
                  placeholder="10100"
                  error={errors.postalCode}
                />

                <div className="col-span-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a country</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <HiOutlineCreditCard className="mr-2 text-blue-600" />
                Payment Method
              </h3>

              <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {/* Payment Method Buttons */}
                  <button
                    type="button"
                    className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                      paymentMethod === "visa"
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setPaymentMethod("visa")}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-10 h-3 me-2 -ms-1"
                      viewBox="0 0 660 203"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M233.003 199.762L266.362 4.002H319.72L286.336 199.762H233.003V199.762ZM479.113 8.222C468.544 4.256 451.978 0 431.292 0C378.566 0 341.429 26.551 341.111 64.604C340.814 92.733 367.626 108.426 387.865 117.789C408.636 127.387 415.617 133.505 415.517 142.072C415.384 155.195 398.931 161.187 383.593 161.187C362.238 161.187 350.892 158.22 333.368 150.914L326.49 147.803L319.003 191.625C331.466 197.092 354.511 201.824 378.441 202.07C434.531 202.07 470.943 175.822 471.357 135.185C471.556 112.915 457.341 95.97 426.556 81.997C407.906 72.941 396.484 66.898 396.605 57.728C396.605 49.591 406.273 40.89 427.165 40.89C444.611 40.619 457.253 44.424 467.101 48.39L471.882 50.649L479.113 8.222V8.222ZM616.423 3.99899H575.193C562.421 3.99899 552.861 7.485 547.253 20.233L468.008 199.633H524.039C524.039 199.633 533.198 175.512 535.27 170.215C541.393 170.215 595.825 170.299 603.606 170.299C605.202 177.153 610.098 199.633 610.098 199.633H659.61L616.423 3.993V3.99899ZM551.006 130.409C555.42 119.13 572.266 75.685 572.266 75.685C571.952 76.206 576.647 64.351 579.34 57.001L582.946 73.879C582.946 73.879 593.163 120.608 595.299 130.406H551.006V130.409V130.409ZM187.706 3.99899L135.467 137.499L129.902 110.37C120.176 79.096 89.8774 45.213 56.0044 28.25L103.771 199.45L160.226 199.387L244.23 3.99699L187.706 3.996"
                        fill="#0E4595"
                      />
                      <path
                        d="M86.723 3.99219H0.682003L0 8.06519C66.939 24.2692 111.23 63.4282 129.62 110.485L110.911 20.5252C107.682 8.12918 98.314 4.42918 86.725 3.99718"
                        fill="#F2AE14"
                      />
                    </svg>
                    Pay with Visa
                  </button>

                  <button
                    type="button"
                    className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                      paymentMethod === "mastercard"
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setPaymentMethod("mastercard")}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 me-2 -ms-1 w-7"
                      viewBox="0 0 601 360"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* SVG path data for MasterCard */}
                      <path
                        d="M359.01 179.504C359.01 278.647 278.639 359.004 179.5 359.004C80.361 359.004 0 278.643 0 179.504C0 80.3709 80.362 0.00390625 179.5 0.00390625C278.637 0.00390625 359.01 80.3749 359.01 179.504Z"
                        fill="#D9222A"
                      />
                      <path
                        d="M420.489 0C374.11 0 331.846 17.596 299.989 46.467C293.499 52.356 287.441 58.704 281.864 65.463H318.131C323.096 71.5 327.667 77.85 331.816 84.475H268.181C264.354 90.597 260.9 96.944 257.839 103.483H342.152C345.046 109.668 347.583 116.013 349.753 122.487H250.24C248.15 128.721 246.408 135.067 245.023 141.495H354.963C357.652 153.985 359.008 166.726 359.005 179.503C359.005 199.438 355.751 218.615 349.751 236.524H250.238C252.402 243.001 254.938 249.348 257.834 255.532H342.15C339.087 262.073 335.631 268.421 331.803 274.545H268.178C272.325 281.165 276.897 287.511 281.863 293.541H318.122C312.552 300.313 306.492 306.668 299.992 312.554C331.849 341.42 374.109 359.008 420.492 359.008C519.631 359.008 600.002 278.647 600.002 179.508C600.002 80.379 519.631 0.00799561 420.492 0.00799561"
                        fill="#EE9F2D"
                      />
                    </svg>
                    Pay with MasterCard
                  </button>

                  <button
                    type="button"
                    className={`text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                      paymentMethod === "amex" ? "bg-[#2557D6]/80" : ""
                    }`}
                    onClick={() => setPaymentMethod("amex")}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-10 h-3 me-2 -ms-1"
                      viewBox="0 0 256 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* SVG path data for AmEx */}
                      <path
                        d="M28.812 0L0 63.76H34.492L38.768 53.594H48.542L52.818 63.76H90.784V56.001L94.167 63.76H113.806L117.189 55.837V63.76H196.148L205.749 53.858L214.739 63.76L255.294 63.842L226.391 32.058L255.294 0H215.368L206.022 9.71899L197.315 0H111.418L104.042 16.457L96.493 0H62.073V7.495L58.244 0C58.244 0 28.812 0 28.812 0ZM35.486 9.05399H52.299L71.41 52.29V9.05399H89.828L104.589 40.054L118.193 9.05399H136.519V54.806H125.368L125.277 18.955L109.02 54.806H99.045L82.697 18.955V54.806H59.757L55.408 44.549H31.912L27.572 54.797H15.281C15.281 54.797 35.486 9.05399 35.486 9.05399ZM146.721 9.05399H192.063L205.931 24.034L220.246 9.05399H234.114L213.043 32.049L234.114 54.779H219.617L205.749 39.625L191.361 54.779H146.721V9.05399ZM43.665 16.795L35.924 35.067H51.397L43.665 16.795ZM157.918 18.527V26.879H182.654V36.188H157.918V45.306H185.663L198.555 31.876L186.21 18.519H157.918V18.527Z"
                        fill="white"
                      />
                    </svg>
                    Pay with American Express
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    className={`text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                      paymentMethod === "paypal" ? "bg-[#F7BE38]/80" : ""
                    }`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <svg
                      className="w-4 h-4 me-2 -ms-1"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="paypal"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
                      ></path>
                    </svg>
                    Check out with PayPal
                  </button>

                  <button
                    type="button"
                    className={`text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${
                      paymentMethod === "apple" ? "bg-[#050708]/80" : ""
                    }`}
                    onClick={() => setPaymentMethod("apple")}
                  >
                    <svg
                      className="w-5 h-5 me-2 -ms-1"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="apple"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                    >
                      <path
                        fill="currentColor"
                        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                      ></path>
                    </svg>
                    Check out with Apple Pay
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <FormInput
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    label="Name on Card"
                    placeholder="John Doe"
                    error={errors.cardName}
                  />

                  <FormInput
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    error={errors.cardNumber}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="text"
                      id="expDate"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleInputChange}
                      label="Expiration Date"
                      placeholder="MM/YY"
                      error={errors.expDate}
                    />

                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CVV
                        <span className="ml-1 inline-block">
                          <HiOutlineQuestionMarkCircle
                            className="text-gray-400 hover:text-gray-500 cursor-help"
                            title="3 or 4 digit security code on your card"
                          />
                        </span>
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== "card" && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    You will be redirected to the selected payment method after
                    reviewing your order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h3>

              {/* Promo Alert */}
              {promoAlert.show && (
                <div
                  className={`mb-4 p-4 rounded-md ${
                    promoAlert.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {promoAlert.type === "success" ? (
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {promoAlert.message}
                      </p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          onClick={closePromoAlert}
                          className={`inline-flex rounded-md p-1.5 ${
                            promoAlert.type === "success"
                              ? "text-green-500 hover:bg-green-100"
                              : "text-red-500 hover:bg-red-100"
                          }`}
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order totals */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal (
                    {selectedItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    items)
                  </span>
                  <span className="font-medium">{formatLKR(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="font-medium">{formatLKR(shipping)}</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">{formatLKR(tax)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-medium">-{formatLKR(discount)}</span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-blue-700">
                      {formatLKR(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo code input */}
              <div className="mb-6">
                <label
                  htmlFor="promoCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-r-0 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none focus:z-10 transition-colors border-gray-300"
                    placeholder="Enter code"
                    disabled={promoApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode || promoApplied}
                    className={`px-4 py-2 rounded-r-md font-medium transition-colors ${
                      promoApplied
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : !promoCode
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-sm text-green-600">
                    Promo code "DESIGN10" applied successfully!
                  </p>
                )}
              </div>

              {/* Security info */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <HiOutlineShieldCheck className="text-green-600 h-5 w-5 mr-2" />
                  <span className="text-sm text-gray-600">
                    Your payment information is secure and encrypted
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p className="mb-2">
                    By completing your purchase, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </a>
                    .
                  </p>
                  <p>
                    For furniture deliveries, please note that assembly services
                    are available at additional cost. Standard delivery times
                    are 3-5 business days.
                  </p>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedItems.length === 0 || isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-bold text-white text-lg transition-colors ${
                  selectedItems.length === 0 || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Complete Purchase"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
