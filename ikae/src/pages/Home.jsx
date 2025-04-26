import React, { useState, useEffect, useCallback, memo } from "react";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";

// ======================================================
// Reusable Components
// ======================================================

/**
 * Star Rating Component - Displays a 5-star rating
 */
const StarRating = memo(() => (
  <div className="flex">
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className="w-5 h-5 text-yellow-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
));

/**
 * Category Card Component - Displays a product category with image and description
 */
const CategoryCard = memo(
  ({ imagePosition = "top", title, description, imageUrl }) => (
    <div className="relative">
      {imagePosition === "top" && (
        <img src={imageUrl} alt={title} className="w-full h-80 object-cover" />
      )}
      <div
        className={`p-6 sm:p-8 ${
          imagePosition === "middle" ? "bg-green-50" : "bg-gray-50"
        }`}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 sm:mb-6">{description}</p>
        <a
          href="#"
          className="text-sm text-gray-600 flex items-center hover:text-gray-900 transition-colors"
        >
          View more <span className="ml-2">›</span>
        </a>
      </div>
      {(imagePosition === "bottom" || imagePosition === "middle") && (
        <img src={imageUrl} alt={title} className="w-full h-80 object-cover" />
      )}
    </div>
  )
);

/**
 * Product Card Component - Displays a product with image, name, rating, and price
 */
const ProductCard = memo(({ product }) => (
  <div className="group">
    <div className="mb-4 sm:mb-6 bg-gray-100 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <h3 className="text-sm font-medium text-center mb-2">{product.name}</h3>
    <div className="flex justify-center mb-2">
      <div className="flex">
        {[...Array(5)].map((_, starIndex) => (
          <span key={starIndex} className="text-yellow-400 text-xl">
            ★
          </span>
        ))}
      </div>
    </div>
    <p className="font-medium text-center">{product.price}</p>
  </div>
));

/**
 * Navigation Arrow Component - Used for review slider
 */
const NavigationArrow = memo(({ direction, onClick }) => (
  <button
    className="absolute top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 z-10 transition-colors"
    onClick={onClick}
    aria-label={`${direction} review`}
    style={{ [direction === "previous" ? "left" : "right"]: "0" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "previous" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
));

/**
 * Feature Card Component - Displays a feature with icon and description
 */
const FeatureCard = memo(({ icon, title, description }) => (
  <div className="text-center px-4 sm:px-6">
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 flex items-center justify-center border border-gray-200 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
));

// ======================================================
// Main Component
// ======================================================

const HomePage = () => {
  // ======= State Management =======
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentReview, setCurrentReview] = useState(0);

  // ======= Product Data =======
  // Product catalog organized by category
  const productCatalog = {
    all: [
      {
        id: 1,
        name: "URBAN LUX HIGH CHAIR",
        image:
          "https://www.urban-411.com/wp-content/uploads/2023/12/LC821-Barstool-view-2-scaled-1.jpg",
        price: "රු 87,149",
      },
      {
        id: 2,
        name: "MORDERN BLACK HANGING LIGHT",
        image:
          "https://img.drz.lazcdn.com/static/lk/p/291d69677655f552e2db72493d8f0236.jpg_720x720q80.jpg",
        price: "රු 518,570",
      },
      {
        id: 3,
        name: "METRO FUSION TABLE",
        image:
          "https://assets.wfcdn.com/im/03783468/compr-r85/6008/60083245/metro-fusion-table-lamp.jpg",
        price: "රු 727,448",
      },
      {
        id: 4,
        name: "LUMIN DESK LAMP",
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "රු 480,285",
      },
      {
        id: 5,
        name: "TIMELESS EDGE HANGING CLOCK",
        image:
          "https://kalasaar.com/cdn/shop/files/MEET5450.jpg?v=1727510207&width=1445",
        price: "රු 348,270",
      },
      {
        id: 6,
        name: "ZENITH PENDANT LIGHT",
        image:
          "https://enne.com.tr/cache/image/large/2021/09/38e4df6be714eb15d8746fd2cefb37a3.png",
        price: "රු 672,617",
      },
    ],
    onSale: [
      // Products with sale/discount
      {
        id: 1,
        name: "URBAN LUX HIGH CHAIR",
        image:
          "https://www.urban-411.com/wp-content/uploads/2023/12/LC821-Barstool-view-2-scaled-1.jpg",
        price: "රු 87,149",
      },
      {
        id: 2,
        name: "MORDERN BLACK HANGING LIGHT",
        image:
          "https://img.drz.lazcdn.com/static/lk/p/291d69677655f552e2db72493d8f0236.jpg_720x720q80.jpg",
        price: "රු 518,570",
      },
      {
        id: 4,
        name: "LUMIN DESK LAMP",
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "රු 480,285",
      },
    ],
    sofa: [
      // Sofa category products
      {
        id: 7,
        name: "MODERN COMFORT SOFA",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "රු 779,997",
      },
      {
        id: 8,
        name: "CLASSIC LEATHER SOFA",
        image:
          "https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "රු 1,137,497",
      },
      {
        id: 9,
        name: "CONTEMPORARY SECTIONAL",
        image:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "රු 1,397,497",
      },
    ],
    hangingLight: [
      // Hanging light category products
      {
        id: 2,
        name: "MORDERN BLACK HANGING LIGHT",
        image:
          "https://img.drz.lazcdn.com/static/lk/p/291d69677655f552e2db72493d8f0236.jpg_720x720q80.jpg",
        price: "රු 518,570",
      },
      {
        id: 6,
        name: "ZENITH PENDANT LIGHT",
        image:
          "https://enne.com.tr/cache/image/large/2021/09/38e4df6be714eb15d8746fd2cefb37a3.png",
        price: "රු 672,617",
      },
      {
        id: 10,
        name: "GEOMETRIC PENDANT LIGHT",
        image:
          "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "රු 292,497",
      },
    ],
  };

  // Customer reviews data
  const reviews = [
    {
      id: 1,
      name: "Mohammed Khalid",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPRe05b-7ElyXcgDeI3kOzX0S7z-ySzDDEjQ&s",
      text: "The sofa is not only incredibly stylish, but also very comfortable to lounge on. The clean lines and minimalist design make it a perfect fit for my modern living room, and the neutral color scheme allows me to easily incorporate other accent pieces.",
    },
    {
      id: 2,
      name: "Fatima Ahmed",
      image:
        "https://images.peopleimages.com/picture/202309/2925746-portrait-of-professional-muslim-woman-office-backdrop.-wearing-hijab.-religion-concept-box_175_175.jpg",
      text: "I absolutely love the modern hanging light I purchased. The design is sleek and elegant, bringing a touch of sophistication to my dining area. The quality is exceptional and the installation was straightforward, which made the entire process hassle-free.",
    },
    {
      id: 3,
      name: "Ahmed Rahman",
      image:
        "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "The Metro Fusion table exceeded my expectations. The craftsmanship is impeccable, and the minimalist design fits perfectly in my apartment. It's both functional and aesthetically pleasing. It has transformed my space completely.",
    },
    {
      id: 4,
      name: "Aisha Malik",
      image:
        "https://photos.peopleimages.com/picture/202309/2925757-portrait-of-professional-muslim-woman-office-backdrop.-wearing-hijab.-religion-concept-box_175_175.jpg",
      text: "I'm extremely pleased with my purchase of the Urban Lux High Chair. The quality is outstanding and the design is both elegant and practical. It's become a centerpiece in our dining room and has received many compliments from guests.",
    },
    {
      id: 5,
      name: "Yusuf Ibrahim",
      image:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "The Timeless Edge Hanging Clock is a perfect addition to my home office. The design is sophisticated yet simple, making it a versatile piece that complements any décor style. The quality is exceptional and it keeps perfect time.",
    },
  ];

  // Features data for "Why Choose Us" section
  const features = [
    {
      title: "GLOBAL DELIVERY",
      description:
        "Experience Hassle-Free Shipping and Seamless Global Connectivity with Our Trustworthy and Efficient Delivery Service.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "FREE SHIPPING",
      description:
        "Shop to Your Heart's Content Without Worrying About Shipping Costs; Our Free Shipping Service Delivers Your Purchases with a Smile.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      title: "24/7 SUPPORTING",
      description:
        "Shop with Confidence Anytime, Anywhere: Our Support Team Is Available 24/7 to Ensure Your Shopping Experience Is Seamless.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      title: "DAILY EMAIL",
      description:
        "Stay Up-to-Date with Your Deliveries: Enjoy the Convenience of Daily Email Updates to Make Your Shopping Experience Even More Enjoyable.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "EASY PAYMENT",
      description:
        "Shop and Pay with Ease: We Offer Multiple Secure Payment Options, Making Your Shopping Experience a Breeze.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      title: "MONTHLY VOUCHER",
      description:
        "More Than Just Shopping: Our Service Rewards Your Loyalty with Monthly Vouchers, Giving You More Reasons to Save on Your Favorite Products.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  // ======= Utility Functions =======

  /**
   * Get products based on the active tab
   */
  const getCurrentProducts = useCallback(() => {
    switch (activeTab) {
      case "ON SALE":
        return productCatalog.onSale;
      case "SOFA":
        return productCatalog.sofa;
      case "HANGING LIGHT":
        return productCatalog.hangingLight;
      default:
        return productCatalog.all;
    }
  }, [
    activeTab,
    productCatalog.onSale,
    productCatalog.sofa,
    productCatalog.hangingLight,
    productCatalog.all,
  ]);

  /**
   * Navigation functions for the review slider
   */
  const goToPrevReview = useCallback(() => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  }, [reviews.length]);

  const goToNextReview = useCallback(() => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  // Auto-slide functionality for reviews
  useEffect(() => {
    const interval = setInterval(goToNextReview, 5000);
    return () => clearInterval(interval);
  }, [goToNextReview]);

  return (
    <div className="bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="h-full min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Blue armchair"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="px-6 py-12 md:pl-10 lg:pl-20">
            <h2 className="text-gray-600 text-sm font-medium mb-2">
              WELCOME TO OUR
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              FURNITURE
              <br />
              GALLERY
            </h1>
            <div className="w-32 sm:w-40 h-0.5 bg-gray-400 mb-6"></div>
            <p className="text-gray-500 text-sm mb-6">BROWSE OUR SELECTIONS</p>
            <p className="text-gray-600 text-sm mb-8 max-w-md">
              Featuring sleek designs and innovative materials that seamlessly
              blend form and function.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0">
        {/* Hanging Light Category */}
        <CategoryCard
          imagePosition="top"
          title="HANGING LIGHT"
          description="Upgrade your space with our modern hanging light, featuring sleek lines, energy-efficient LED lighting, and adjustable height."
          imageUrl="https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        />

        {/* Designed Sofa Category */}
        <CategoryCard
          imagePosition="middle"
          title="DESIGNED SOFA"
          description="Introducing our newest sofa, the perfect combination of style and comfort, designed to elevate your living space and provide ultimate relaxation."
          imageUrl="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        />

        {/* Nova Chair Category */}
        <CategoryCard
          imagePosition="bottom"
          title="NOVA CHAIR"
          description="A stylish and comfortable addition to any room, with its sleek design and plush cushions creating the ultimate seating experience."
          imageUrl="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
        />
      </section>

      {/* Customer Reviews */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            REVIEWED BY CUSTOMERS
          </h2>
          <p className="text-center text-gray-700 mb-16 sm:mb-20">
            WHAT OUR CUSTOMERS THINK ABOUT US?
          </p>

          <div className="text-center relative">
            {/* Navigation Arrows */}
            <NavigationArrow direction="previous" onClick={goToPrevReview} />
            <NavigationArrow direction="next" onClick={goToNextReview} />

            {/* Customer Image */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full border-2 border-gray-200">
                <img
                  src={reviews[currentReview].image}
                  alt={reviews[currentReview].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-center mb-8 sm:mb-10">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className="text-yellow-400 text-xl sm:text-2xl"
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-800 italic mb-8 sm:mb-10 max-w-4xl mx-auto text-base sm:text-lg leading-relaxed px-8 sm:px-4">
              "{reviews[currentReview].text}"
            </p>

            {/* Customer Name */}
            <p className="text-gray-500 font-light text-lg">
              - {reviews[currentReview].name} -
            </p>

            {/* Review Indicator Dots */}
            <div className="flex justify-center mt-10 sm:mt-12 space-x-3">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`w-8 sm:w-10 h-1 ${
                    index === currentReview ? "bg-gray-900" : "bg-gray-300"
                  } transition-colors`}
                  onClick={() => setCurrentReview(index)}
                  aria-label={`Go to review ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
            FEATURED PRODUCTS
          </h2>

          {/* Product Tabs */}
          <div className="flex justify-center mb-12 sm:mb-16 overflow-x-auto">
            <nav className="flex border-b border-gray-200">
              {["ALL", "ON SALE", "SOFA", "HANGING LIGHT"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 sm:px-6 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {getCurrentProducts()
              .slice(0, 6)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="bg-gray-100 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              MODERN BRONZE HANGING LIGHT
            </h2>
            <div className="flex">
              <StarRating />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-gray-500 line-through text-lg">
                රු 1,057,033
              </span>
              <span className="text-2xl sm:text-3xl font-bold">රු 764,533</span>
              <span className="bg-red-600 text-white text-xs px-2 py-1">
                -රු 292,500
              </span>
            </div>
            <div className="border-t border-gray-300 pt-6 mt-6">
              <p className="text-gray-700">
                Stunning lighting fixture that combines contemporary style with
                timeless elegance. Featuring a sleek and minimalist design, this
                hanging light is crafted from high-quality bronze and finished
                with a smooth and lustrous surface.
              </p>
            </div>
            <button className="bg-gray-900 text-white py-3 px-8 hover:bg-gray-800 transition-colors">
              BUY NOW
            </button>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Bronze hanging lights"
              className="w-full rounded-sm shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
          WHY CHOOSE US?
        </h2>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 sm:gap-y-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
