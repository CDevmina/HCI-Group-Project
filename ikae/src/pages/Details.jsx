import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PresentationControls,
  Environment,
  Html,
  useProgress,
} from "@react-three/drei";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  CubeIcon,
  CheckIcon,
  StarIcon,
  PlusIcon,
  MinusIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// Product data model - would normally come from an API
const productData = {
  id: "modern-chair-01",
  name: "Modern Ergonomic Office Chair",
  category: "chairs",
  price: 299.95, // Price in USD (will be converted to LKR)
  rating: 4.8,
  reviewCount: 127,
  inStock: true,
  description:
    "Experience unparalleled comfort with our Modern Ergonomic Office Chair. Designed with your well-being in mind, this chair features adjustable lumbar support, breathable mesh backrest, and customizable height and tilt settings. Perfect for long work sessions, its premium materials ensure durability while the sleek design complements any modern office environment.",
  features: [
    "Adjustable lumbar support for optimal back positioning",
    "Breathable mesh backrest promotes airflow during extended use",
    "360° swivel with smooth-rolling casters for effortless movement",
    "Premium high-density foam cushioning for lasting comfort",
    "Adjustable armrests with soft padding to reduce arm fatigue",
    "Weight capacity of 125 kg for reliable support",
  ],
  specs: {
    dimensions: {
      overall: { width: 68, depth: 70, height: "115-125" },
      seat: { width: 52, depth: 50, height: "45-55" },
    },
    materials: {
      frame: "High-grade aluminum alloy",
      upholstery: "Breathable mesh fabric",
      base: "Reinforced nylon with fiberglass",
    },
    adjustability: {
      height: "Pneumatic adjustment from 45cm to 55cm",
      tilt: "Synchronized tilt with tension control",
      armrests: "3D adjustable (height, width, depth)",
    },
    warranty: "5-year manufacturer warranty",
  },
  colors: [
    { name: "Midnight Black", hex: "#252525", id: "black" },
    { name: "Steel Gray", hex: "#71797E", id: "gray" },
    { name: "Navy Blue", hex: "#2B3A67", id: "blue" },
    { name: "Forest Green", hex: "#2C5530", id: "green" },
    { name: "Burgundy", hex: "#800020", id: "burgundy" },
  ],
  images: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Premium ergonomic office chair with mesh back and adjustable features - front view",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Premium ergonomic office chair with lumbar support - side view",
    },
    {
      id: 3,
      src: "https://cdn.prod.website-files.com/6683ea3c88308d9e9146b3d3/66b4a478929be7446558d98e_arran_gal1.webp",
      alt: "Ergonomic chair showing breathable mesh backrest - back view",
    },
    {
      id: 4,
      src: "https://daniafurniture.com/cdn/shop/products/4997-barrier-desk-chair-med.jpg?v=1715195137",
      alt: "Modern office chair in a contemporary workspace setting",
    },
  ],
  relatedProducts: [
    {
      id: "exec-chair-02",
      name: "Executive High-Back Chair",
      price: 389.95,
      image:
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
    },
    {
      id: "task-chair-03",
      name: "Multi-Function Task Chair",
      price: 249.95,
      image:
        "https://boss-chair.com/wp-content/uploads/2017/06/B3036-BK-RV.jpg",
      rating: 4.5,
    },
    {
      id: "stool-04",
      name: "Adjustable Ergonomic Stool",
      price: 179.95,
      image:
        "https://images.unsplash.com/photo-1617582907226-c49e2d8200d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.3,
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Mohammed A.",
      rating: 5,
      title: "Best office chair I've ever owned",
      comment:
        "After trying several chairs over the years, this one offers the perfect balance of support and comfort. My back pain has significantly reduced since I started using it.",
      date: "March 15, 2025",
      verified: true,
    },
    {
      id: 2,
      user: "Ahmed F.",
      rating: 4,
      title: "Great chair, minor assembly issues",
      comment:
        "The chair is excellent and very comfortable for long work sessions. Only giving 4 stars because the assembly instructions could be clearer. Once assembled though, it's perfect.",
      date: "February 28, 2025",
      verified: true,
    },
    {
      id: 3,
      user: "Fatima K.",
      rating: 5,
      title: "Worth every rupee",
      comment:
        "I was hesitant about spending this much on an office chair, but after using it for a month, I can confidently say it's worth the investment. The adjustability is fantastic and the mesh back keeps me cool during long work sessions.",
      date: "February 12, 2025",
      verified: true,
    },
  ],
};

// 3D Chair model component
const Chair = ({ color }) => {
  return (
    <group dispose={null}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.25, -0.25]} castShadow>
        <boxGeometry args={[0.6, 1.5, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// 3D model loading indicator
const ModelLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">
          {progress.toFixed(0)}% loaded
        </p>
      </div>
    </Html>
  );
};

// Star rating component
const RatingStars = ({ rating }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${
            index < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : index < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

// Currency formatter
const formatPrice = (price) => {
  // Convert price to Sri Lankan Rupees (approximately 1 USD = 320 LKR)
  const lkrPrice = price * 320;
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(lkrPrice);
};

// Main product details component
const ProductDetailsPage = () => {
  const navigate = useNavigate();

  // In a real app, we would use useParams to get productId and fetch product data
  const product = productData;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [show3D, setShow3D] = useState(false);
  const [isAddedToRoom, setIsAddedToRoom] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSpecs, setExpandedSpecs] = useState(false);

  // Handle back navigation
  const handleBackToProducts = () => {
    navigate("/products");
  };

  // Image carousel controls
  const changeImage = (index) => setCurrentImageIndex(index);
  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  // Quantity controls
  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  // Add to room functionality
  const handleAddToRoom = () => {
    setIsAddedToRoom(true);
    setTimeout(() => setIsAddedToRoom(false), 2000);
  };

  // Toggle 3D view
  const toggle3DView = () => setShow3D(!show3D);

  // Scroll to reviews section
  const scrollToReviews = () => {
    document.getElementById("reviews-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  // Reset 3D view when color changes
  useEffect(() => {
    if (show3D) {
      const timer = setTimeout(() => {
        setShow3D(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedColor, show3D]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-500">
            <button
              onClick={handleBackToProducts}
              className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Products
            </button>
            <span>/</span>
            <a href="/products" className="hover:text-gray-900">
              Furniture
            </a>
            <span>/</span>
            <a href="/products?category=chairs" className="hover:text-gray-900">
              Chairs
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Product Image Gallery - Responsive */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-full">
                <div className="rounded-lg overflow-hidden bg-gray-100 w-full max-w-[600px] h-[400px] mx-auto">
                  {!show3D ? (
                    <img
                      src={product.images[currentImageIndex].src}
                      alt={product.images[currentImageIndex].alt}
                      className="w-full h-full object-contain"
                      style={{ transition: "opacity 0.3s" }}
                    />
                  ) : (
                    <div className="w-full h-full">
                      <Canvas
                        shadows
                        camera={{ position: [0, 2, 5], fov: 50 }}
                        className="w-full h-full"
                      >
                        <ambientLight intensity={0.5} />
                        <spotLight
                          position={[10, 10, 10]}
                          angle={0.15}
                          penumbra={1}
                          intensity={1}
                          castShadow
                        />
                        <PresentationControls
                          global
                          zoom={1}
                          rotation={[0, 0, 0]}
                          polar={[-Math.PI / 4, Math.PI / 4]}
                          azimuth={[-Math.PI / 4, Math.PI / 4]}
                        >
                          <Chair color={selectedColor.hex} />
                        </PresentationControls>
                        <Environment preset="city" />
                        <mesh
                          rotation={[-Math.PI / 2, 0, 0]}
                          position={[0, -0.5, 0]}
                          receiveShadow
                        >
                          <planeGeometry args={[10, 10]} />
                          <shadowMaterial transparent opacity={0.2} />
                        </mesh>
                        <OrbitControls
                          enablePan={true}
                          enableZoom={true}
                          minPolarAngle={0}
                          maxPolarAngle={Math.PI / 2}
                        />
                        <ModelLoader />
                      </Canvas>
                    </div>
                  )}
                </div>

                {/* Image Navigation Arrows */}
                {!show3D && (
                  <>
                    <button
                      type="button"
                      className="absolute top-1/2 left-4 -mt-4 rounded-full bg-white p-2 text-gray-900 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="absolute top-1/2 right-4 -mt-4 rounded-full bg-white p-2 text-gray-900 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </>
                )}

                {/* 3D View Toggle */}
                <button
                  type="button"
                  className="absolute bottom-4 right-4 flex items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  onClick={toggle3DView}
                  aria-pressed={show3D}
                >
                  {show3D ? (
                    <>
                      <img
                        src={product.images[0].src}
                        alt="2D View"
                        className="w-5 h-5 mr-2 rounded"
                      />
                      <span>View Photos</span>
                    </>
                  ) : (
                    <>
                      <CubeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                      <span>View 3D Model</span>
                    </>
                  )}
                </button>
              </div>

              {/* Thumbnail Images - Responsive */}
              {!show3D && (
                <div className="mt-4 grid grid-cols-4 gap-2 max-w-[600px] w-full mx-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      className={`relative flex items-center justify-center rounded-md overflow-hidden ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-500"
                          : "ring-1 ring-transparent hover:ring-gray-300"
                      } focus:outline-none`}
                      onClick={() => changeImage(index)}
                      aria-label={`View ${image.alt}`}
                    >
                      <img
                        src={image.src}
                        alt={`Thumbnail for ${image.alt}`}
                        className="h-16 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="mt-10 px-0 sm:mt-16 lg:mt-0">
              {/* Product Info */}
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center">
                  <div className="flex items-center">
                    <RatingStars rating={product.rating} />
                  </div>
                  <button
                    className="ml-2 text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                    onClick={scrollToReviews}
                  >
                    {product.reviewCount} reviews
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Description
                  </h3>
                  <div className="mt-2 text-base text-gray-700">
                    <p>{product.description}</p>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="mt-3">
                    <div className="flex flex-wrap items-center space-x-3">
                      {product.colors.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          className={`relative h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                            selectedColor.id === color.id
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          }`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select ${color.name} color`}
                        >
                          {selectedColor.id === color.id && (
                            <CheckIcon
                              className={`h-4 w-4 ${
                                parseInt(color.hex.replace("#", ""), 16) >
                                0xffffff / 2
                                  ? "text-gray-900"
                                  : "text-white"
                              }`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Selected:{" "}
                      <span className="font-medium">{selectedColor.name}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Quantity
                  </h3>
                  <div className="mt-2 flex items-center">
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`rounded-l-md p-2 border border-r-0 border-gray-300 ${
                        quantity <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <MinusIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="h-10 w-14 border-gray-300 text-center focus:outline-none"
                      aria-label="Quantity"
                    />
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      disabled={quantity >= 10}
                      className={`rounded-r-md p-2 border border-l-0 border-gray-300 ${
                        quantity >= 10
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <PlusIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleAddToRoom}
                    disabled={isAddedToRoom}
                    className={`${
                      isAddedToRoom
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } flex-1 flex items-center justify-center px-4 sm:px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                  >
                    {isAddedToRoom ? (
                      <>
                        <CheckCircleIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        Added to Room
                      </>
                    ) : (
                      <>
                        <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                        Add to Room Design
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <HeartIcon
                      className={`h-6 w-6 ${
                        isFavorite
                          ? "text-red-500 fill-current"
                          : "text-gray-500"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Share product"
                  >
                    <ShareIcon
                      className="h-6 w-6 text-gray-500"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {/* Features and Dimensions Tabs */}
                <div className="mt-10">
                  <div>
                    <div className="flex flex-wrap space-x-2 sm:space-x-4 border-b border-gray-200">
                      {["Features", "Dimensions & Specs", "Warranty"].map(
                        (tab, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`py-2 px-2 sm:px-4 text-sm font-medium border-b-2 focus:outline-none ${
                              activeTab === idx
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            aria-selected={activeTab === idx}
                            role="tab"
                          >
                            {tab}
                          </button>
                        )
                      )}
                    </div>
                    <div className="mt-4">
                      {/* Features Tab Panel */}
                      {activeTab === 0 && (
                        <div className="py-2">
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckIcon
                                  className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="ml-2 text-gray-700">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dimensions Tab Panel */}
                      {activeTab === 1 && (
                        <div className="py-2">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                Dimensions (cm)
                              </h4>
                              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="block text-xs text-gray-500">
                                    Overall Width
                                  </span>
                                  <span className="block font-medium">
                                    {product.specs.dimensions.overall.width} cm
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="block text-xs text-gray-500">
                                    Overall Depth
                                  </span>
                                  <span className="block font-medium">
                                    {product.specs.dimensions.overall.depth} cm
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="block text-xs text-gray-500">
                                    Overall Height
                                  </span>
                                  <span className="block font-medium">
                                    {product.specs.dimensions.overall.height} cm
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="block text-xs text-gray-500">
                                    Seat Width
                                  </span>
                                  <span className="block font-medium">
                                    {product.specs.dimensions.seat.width} cm
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="block text-xs text-gray-500">
                                    Seat Depth
                                  </span>
                                  <span className="block font-medium">
                                    {product.specs.dimensions.seat.depth} cm
                                  </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="block text-xs text-gray-500">
                                    Seat Height
                                  </span>
                                  <span className="block font-medium">
                                    {product.specs.dimensions.seat.height} cm
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setExpandedSpecs(!expandedSpecs)}
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                            >
                              {expandedSpecs
                                ? "Show less specs"
                                : "Show more specs"}
                              <ChevronRightIcon
                                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                                  expandedSpecs ? "rotate-90" : ""
                                }`}
                                aria-hidden="true"
                              />
                            </button>

                            {expandedSpecs && (
                              <div className="mt-4 space-y-4 text-sm">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    Materials
                                  </h4>
                                  <ul className="mt-2 space-y-2">
                                    <li className="flex justify-between">
                                      <span className="text-gray-500">
                                        Frame
                                      </span>
                                      <span>
                                        {product.specs.materials.frame}
                                      </span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span className="text-gray-500">
                                        Upholstery
                                      </span>
                                      <span>
                                        {product.specs.materials.upholstery}
                                      </span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span className="text-gray-500">
                                        Base
                                      </span>
                                      <span>
                                        {product.specs.materials.base}
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    Adjustability
                                  </h4>
                                  <ul className="mt-2 space-y-2">
                                    <li className="flex justify-between">
                                      <span className="text-gray-500">
                                        Height
                                      </span>
                                      <span>
                                        {product.specs.adjustability.height}
                                      </span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span className="text-gray-500">
                                        Tilt
                                      </span>
                                      <span>
                                        {product.specs.adjustability.tilt}
                                      </span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span className="text-gray-500">
                                        Armrests
                                      </span>
                                      <span>
                                        {product.specs.adjustability.armrests}
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Warranty Tab Panel */}
                      {activeTab === 2 && (
                        <div className="py-2">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-start">
                              <InformationCircleIcon
                                className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800">
                                  Warranty Information
                                </h4>
                                <p className="mt-1 text-sm text-blue-700">
                                  This product comes with a{" "}
                                  {product.specs.warranty} covering
                                  manufacturing defects and hardware failure
                                  under normal usage conditions.
                                </p>
                                <a
                                  href="#"
                                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                                >
                                  View full warranty details
                                  <ChevronRightIcon
                                    className="ml-1 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <section
            id="reviews-section"
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                Customer Reviews
              </h2>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-auto"
              >
                Write a review
              </button>
            </div>

            <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-4">
                <div className="flex items-center">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {product.rating}
                  </h3>
                  <div className="ml-2">
                    <div className="flex items-center">
                      <RatingStars rating={product.rating} />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">
                    Rating Distribution
                  </h3>
                  <div className="mt-2 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      // Mock data for rating distribution
                      const percentage =
                        rating === 5
                          ? 68
                          : rating === 4
                          ? 24
                          : rating === 3
                          ? 6
                          : rating === 2
                          ? 1
                          : 1;

                      return (
                        <div key={rating} className="flex items-center text-sm">
                          <div className="flex-1 flex items-center">
                            <span className="w-3">{rating}</span>
                            <StarIcon
                              className="h-4 w-4 ml-1 text-yellow-400 fill-current"
                              aria-hidden="true"
                            />
                            <div className="ml-3 flex-1">
                              <div className="h-2 rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-yellow-400"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <span className="ml-3 w-9 text-right text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-10 lg:mt-0 lg:col-span-8">
                <div className="flow-root">
                  <div className="-my-6 divide-y divide-gray-200">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="py-6">
                        <div className="flex items-center">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">
                              {review.user}
                            </h4>
                            <div className="mt-1 flex items-center">
                              <RatingStars rating={review.rating} />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              {review.date}
                            </p>
                          </div>
                          {review.verified && (
                            <div className="ml-4 flex-shrink-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckIcon
                                  className="h-3 w-3 mr-1"
                                  aria-hidden="true"
                                />
                                Verified Purchase
                              </span>
                            </div>
                          )}
                        </div>
                        <h5 className="mt-2 text-sm font-medium text-gray-900">
                          {review.title}
                        </h5>
                        <p className="mt-2 text-sm text-gray-600">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Load more reviews
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Related Products Section */}
          <section
            aria-labelledby="related-products-heading"
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <h2
              id="related-products-heading"
              className="text-2xl font-bold text-gray-900"
            >
              Customers also viewed
            </h2>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
              {product.relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative">
                  <div className="relative w-full h-56 rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-75">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        <a href={`/products/${relatedProduct.id}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {relatedProduct.name}
                        </a>
                      </h3>
                      <div className="mt-1 flex items-center">
                        <RatingStars rating={relatedProduct.rating} />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
