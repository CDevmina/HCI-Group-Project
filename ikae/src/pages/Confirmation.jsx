import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck,
  HiOutlineShoppingBag,
  HiOutlineQuestionMarkCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineDownload,
} from "react-icons/hi";
import NavBar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [showFAQ, setShowFAQ] = useState(Array(3).fill(false));
  const [countdown, setCountdown] = useState(5);
  const [isAnimating, setIsAnimating] = useState(true);

  // Generate order information
  const orderNumber = "IKAE-" + Math.floor(100000 + Math.random() * 900000);

  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Estimated delivery date (current date + 5 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const estimatedDelivery = deliveryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mock order details - in a real app, this would come from state management
  const orderDetails = {
    items: [
      {
        id: 1,
        name: "Modern Ergonomic Chair",
        color: "Gray",
        quantity: 1,
        price: 54999,
      },
      {
        id: 2,
        name: "Solid Oak Dining Table",
        color: "Natural Oak",
        quantity: 1,
        price: 199999,
      },
      {
        id: 3,
        name: "Designer Side Table",
        color: "Black/Glass",
        quantity: 2,
        price: 32999 * 2,
      },
    ],
    subtotal: 320996,
    shipping: 9999,
    tax: 32099,
    discount: 32099, // 10% discount
    total: 330995,
    shippingAddress:
      "123 Main Street, Colombo, Western Province, Sri Lanka, 10100",
    paymentMethod: "Visa ending in 4242",
  };

  // Success animation effect
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);

    return () => clearTimeout(animationTimer);
  }, []);

  // Email timer simulation effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Toggle FAQ section
  const toggleFAQ = (index) => {
    const newShowFAQ = [...showFAQ];
    newShowFAQ[index] = !newShowFAQ[index];
    setShowFAQ(newShowFAQ);
  };

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

  // Component for FAQ items
  const FAQItem = ({ index, question, answer }) => (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button
        onClick={() => toggleFAQ(index)}
        className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left font-medium"
      >
        <span>{question}</span>
        {showFAQ[index] ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
      </button>
      {showFAQ[index] && (
        <div className="px-4 py-3 text-gray-600 text-sm bg-gray-50 border-t border-gray-200">
          {answer}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Success Message */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <div
              className={`relative inline-flex mx-auto mb-6 transition-all duration-1000 ${
                isAnimating ? "scale-125" : "scale-100"
              }`}
            >
              <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-25"></div>
              <HiOutlineCheckCircle className="relative text-green-500 h-24 w-24" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your order has been received and is being processed. You will
              receive a confirmation email shortly.
            </p>

            <div className="inline-block bg-green-50 text-green-700 rounded-full px-4 py-2 font-medium text-sm mb-6">
              Order #{orderNumber} • {orderDate}
            </div>

            {countdown > 0 ? (
              <div className="text-sm text-gray-500 italic">
                Sending confirmation email... {countdown}s
              </div>
            ) : (
              <div className="text-sm text-green-600">
                Confirmation email sent to your registered email address!
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <HiOutlineClipboardCheck className="mr-2 text-blue-600" />
                Order Summary
              </h2>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Items Ordered
                </h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between border-b border-gray-100 pb-3"
                    >
                      <div>
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.name}
                        <div className="text-sm text-gray-500">
                          Color: {item.color}
                        </div>
                      </div>
                      <div className="font-medium">{formatLKR(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Shipping Address
                  </h3>
                  <address className="not-italic text-gray-600 leading-relaxed">
                    {orderDetails.shippingAddress}
                  </address>

                  <div className="mt-5">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Payment Method
                    </h3>
                    <p className="text-gray-600">
                      {orderDetails.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Order Details
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatLKR(orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>{formatLKR(orderDetails.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>{formatLKR(orderDetails.tax)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount (Promo: DESIGN10):</span>
                      <span>-{formatLKR(orderDetails.discount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 mt-2">
                      <span>Total:</span>
                      <span className="text-blue-700">
                        {formatLKR(orderDetails.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="font-medium text-gray-700 mb-1">
                      Estimated Delivery
                    </h4>
                    <p className="text-gray-600">{estimatedDelivery}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      * Standard delivery: 3-5 business days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() =>
                navigate("/track-order", { state: { orderNumber } })
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <HiOutlineClipboardCheck className="mr-2 h-5 w-5" />
              Track Your Order
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </button>

            <button
              onClick={() => window.print()}
              className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <HiOutlineDownload className="mr-2 h-5 w-5" />
              Print Receipt
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <HiOutlineQuestionMarkCircle className="mr-2 text-blue-600" />
                Need Help?
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="flex-1 mb-6 md:mb-0">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Contact Customer Support
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:support@ikaefurniture.lk"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <HiOutlineMail className="mr-2 h-5 w-5" />
                      support@ikaefurniture.lk
                    </a>
                    <a
                      href="tel:+94111234567"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <HiOutlinePhone className="mr-2 h-5 w-5" />
                      +94 11 123 4567
                    </a>
                    <p className="text-sm text-gray-500">
                      Our customer service team is available Monday to Friday, 9
                      AM - 6 PM.
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    <FAQItem
                      index={0}
                      question="When will my order be delivered?"
                      answer="Standard delivery takes 3-5 business days. You can track your order status using the track order button above. For custom furniture items, delivery times may be longer and will be specified in your confirmation email."
                    />

                    <FAQItem
                      index={1}
                      question="What is your return policy?"
                      answer="IKAE offers a 30-day return policy for most items. If you're not satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Please note that custom or personalized items cannot be returned unless they arrive damaged or defective."
                    />

                    <FAQItem
                      index={2}
                      question="Can I modify my order?"
                      answer="Order modifications are possible within the first hour of placing your order. Please contact IKAE customer support immediately if you need to make changes. After the order has entered processing, modifications may not be possible."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Recommended product item */}
              {[
                {
                  image:
                    "https://i5.walmartimages.com/asr/a5251b94-c9cb-4aa0-9c4f-89046831099e.0bf015cb9bb21ba7be2215aad60eed65.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
                  name: "IKAE Accent Chair",
                  price: 39999,
                },
                {
                  image:
                    "https://images-cdn.ubuy.qa/66173e6860ca375497165821-dextrus-farmhouse-coffee-table-2-tier.jpg",
                  name: "IKAE Coffee Table",
                  price: 54999,
                },
                {
                  image:
                    "https://m.media-amazon.com/images/I/41f-JYtS0DL._AC_US750_.jpg",
                  name: "IKAE Floor Lamp",
                  price: 28999,
                },
              ].map((product, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="bg-gray-100 rounded-lg p-3 h-40 flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">{formatLKR(product.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
