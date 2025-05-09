import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";

// Mock data with prices in LKR - conversion rate approx. 320 LKR per USD
const FURNITURE_DATA = [
  {
    id: 1,
    name: "Ergonomic Office Chair",
    category: "chairs",
    price: 95680,
    colors: ["#2E3A59", "#F9F9F9", "#96684A"],
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3",
    additionalImages: [
      "https://sylex.com/cdn/shop/articles/view7_fa1c191c-e486-4604-9ab3-af6b89ef4956_1600x.jpg?v=1639532758",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3",
    ],
    description:
      "An ergonomic office chair designed for comfort during long work sessions. Features adjustable height, armrests, and lumbar support.",
    details: [
      "Ergonomic design with adjustable lumbar support",
      "High-density foam cushion for comfort",
      "Breathable mesh back for ventilation",
      "360° swivel with smooth-rolling casters",
      "Maximum weight capacity: 136 kg",
    ],
    dimensions: { width: 60, depth: 65, height: 115 },
    rating: 4.7,
    reviews: 124,
    inStock: true,
    deliveryTime: "3-5 days",
    tags: ["office", "ergonomic", "modern"],
    materials: ["Mesh", "Aluminum", "High-density foam"],
    discount: 15,
  },
  {
    id: 2,
    name: "Scandinavian Dining Table",
    category: "tables",
    price: 175680,
    colors: ["#96684A", "#4C4C4C", "#D7CFC1"],
    image:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3",
    ],
    description:
      "A minimalist Scandinavian-style dining table made from sustainable oak wood. Perfect for family gatherings.",
    details: [
      "Crafted from sustainable solid oak wood",
      "Natural oil finish that highlights the wood grain",
      "Sturdy construction with tapered legs",
      "Seats up to 6 people comfortably",
      "Easy to assemble with included hardware",
    ],
    dimensions: { width: 160, depth: 90, height: 75 },
    rating: 4.9,
    reviews: 86,
    inStock: true,
    deliveryTime: "7-10 days",
    tags: ["dining", "scandinavian", "wood"],
    materials: ["Solid oak", "Natural oil finish"],
    discount: 0,
  },
  {
    id: 3,
    name: "Modern Sectional Sofa",
    category: "sofas",
    price: 415680,
    colors: ["#383838", "#D7CFC1", "#496083"],
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3",
    ],
    description:
      "A spacious and stylish sectional sofa with chaise lounge. Made with high-quality fabric and memory foam cushions.",
    details: [
      "L-shaped design with chaise lounge",
      "Premium upholstery with stain-resistant treatment",
      "High-density memory foam cushions",
      "Solid wood frame for durability",
      "Modular design for flexible arrangement",
    ],
    dimensions: { width: 280, depth: 170, height: 85 },
    rating: 4.6,
    reviews: 92,
    inStock: true,
    deliveryTime: "10-14 days",
    tags: ["living room", "modern", "comfortable"],
    materials: ["Premium fabric", "Memory foam", "Solid wood"],
    discount: 0,
  },
  {
    id: 4,
    name: "Coffee Table with Storage",
    category: "tables",
    price: 105280,
    colors: ["#96684A", "#383838"],
    image:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1565191999031-a3b4582d3091?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1532372320572-cda25653a694?ixlib=rb-4.0.3",
    ],
    description:
      "A practical coffee table with hidden storage compartments. Modern design with a mix of wood and metal elements.",
    details: [
      "Lift-top mechanism reveals hidden storage",
      "Dual compartments for organized storage",
      "Metal frame with wood finish top",
      "Scratch-resistant surface treatment",
      "Non-marking foot pads to protect floors",
    ],
    dimensions: { width: 120, depth: 60, height: 40 },
    rating: 4.5,
    reviews: 65,
    inStock: true,
    deliveryTime: "5-7 days",
    tags: ["living room", "storage", "modern"],
    materials: ["Engineered wood", "Metal", "Tempered glass"],
    discount: 10,
  },
  {
    id: 5,
    name: "Accent Armchair",
    category: "chairs",
    price: 143680,
    colors: ["#4F6D8C", "#D7CFC1", "#96684A", "#383838"],
    image:
      "https://images.unsplash.com/photo-1586158291800-2665f07bba79?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3",
    ],
    description:
      "A comfortable accent armchair perfect for reading corners. Features curved lines and premium upholstery.",
    details: [
      "Mid-century modern design",
      "Premium velvet upholstery",
      "Deep seat with high-density foam",
      "Solid beech wood legs",
      "360° swivel base available in select colors",
    ],
    dimensions: { width: 75, depth: 80, height: 90 },
    rating: 4.8,
    reviews: 57,
    inStock: true,
    deliveryTime: "7-10 days",
    tags: ["living room", "accent", "reading"],
    materials: ["Velvet upholstery", "Beech wood", "High-density foam"],
    discount: 0,
  },
  {
    id: 6,
    name: "Queen Size Bed Frame",
    category: "beds",
    price: 255680,
    colors: ["#96684A", "#383838"],
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3",
    ],
    description:
      "A sturdy queen-size bed frame with a padded headboard. Includes under-bed storage drawers.",
    details: [
      "Queen size (160 x 200 cm) with sturdy construction",
      "Upholstered headboard with tufted design",
      "4 spacious under-bed storage drawers",
      "Solid wood slats - no box spring needed",
      "Reinforced center support for durability",
    ],
    dimensions: { width: 165, depth: 210, height: 110 },
    rating: 4.7,
    reviews: 78,
    inStock: true,
    deliveryTime: "14-21 days",
    tags: ["bedroom", "queen", "storage"],
    materials: ["Engineered wood", "Linen upholstery", "Metal supports"],
    discount: 5,
  },
  {
    id: 7,
    name: "Minimalist Bookshelf",
    category: "storage",
    price: 86400,
    colors: ["#FFFFFF", "#383838", "#96684A"],
    image:
      "https://images.unsplash.com/photo-1588627541420-fce3f661b779?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3",
    ],
    description:
      "A minimalist open bookshelf with a ladder design. Perfect for displaying books and decorative items.",
    details: [
      "Five-tier ladder-style bookcase",
      "Stable A-frame design that leans against the wall",
      "Each shelf supports up to 15 kg",
      "Anti-tip wall mounting hardware included",
      "Easy assembly with included tools",
    ],
    dimensions: { width: 80, depth: 40, height: 180 },
    rating: 4.6,
    reviews: 42,
    inStock: true,
    deliveryTime: "5-7 days",
    tags: ["storage", "minimalist", "display"],
    materials: ["Engineered wood", "Metal supports"],
    discount: 0,
  },
  {
    id: 8,
    name: "Scandinavian Floor Lamp",
    category: "lighting",
    price: 48000,
    colors: ["#F9F9F9", "#383838", "#96684A"],
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3",
    additionalImages: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1542728928-1413d1894ed1?ixlib=rb-4.0.3",
    ],
    description:
      "A modern floor lamp with adjustable height and direction. Perfect for reading or ambient lighting.",
    details: [
      "Height-adjustable design (120-150 cm)",
      "Rotatable shade for directed lighting",
      "Energy-efficient LED bulb included (9W, 800 lumens)",
      "3-step dimming function with touch control",
      "Natural cotton shade for soft diffused light",
    ],
    dimensions: { width: 30, depth: 30, height: 150 },
    rating: 4.8,
    reviews: 36,
    inStock: true,
    deliveryTime: "3-5 days",
    tags: ["lighting", "scandinavian", "modern"],
    materials: ["Cotton shade", "Metal frame", "Wooden base"],
    discount: 20,
  },
];

// Format price with Sri Lankan Rupee currency (using en-US locale to avoid Sinhala letters)
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
  if (!discount) return price;
  return price - (price * discount) / 100;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Simulate loading product data
    setLoading(true);
    window.scrollTo(0, 0);

    setTimeout(() => {
      // Find product by ID
      const foundProduct = FURNITURE_DATA.find(
        (item) => item.id === parseInt(id)
      );

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]); // Set the first color as default
        setCurrentImage(foundProduct.image);

        // Find related products in the same category (up to 4)
        let related = FURNITURE_DATA.filter(
          (item) =>
            item.category === foundProduct.category &&
            item.id !== foundProduct.id
        );

        // If we don't have enough products in the same category, add some from other categories
        if (related.length < 4) {
          const otherProducts = FURNITURE_DATA.filter(
            (item) =>
              item.category !== foundProduct.category &&
              item.id !== foundProduct.id
          ).slice(0, 4 - related.length);

          related = [...related, ...otherProducts];
        }

        // Ensure we only have 4 related products
        setRelatedProducts(related.slice(0, 4));
      } else {
        // If product not found, redirect back to products page
        navigate("/products");
      }

      setLoading(false);
    }, 500);
  }, [id, navigate]);

  // Handle Add to Cart action
  const handleAddToCart = () => {
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleImageChange = (image) => {
    setCurrentImage(image);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null; // Will redirect in useEffect
  }

  const allImages = [product.image, ...(product.additionalImages || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Add spacing after navbar */}
      <div className="pt-16"></div>

      {/* Notification */}
      {showNotification && (
        <div
          className="fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in-out flex items-center"
          role="alert"
        >
          <div className="flex-shrink-0 mr-2">
            <svg
              className="h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">{product.name} added to your cart!</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <nav className="text-sm" aria-label="Breadcrumb">
          <ol className="list-none p-0 flex flex-wrap">
            <li className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-blue-600"
              >
                Home
              </button>
              <svg
                className="w-3 h-3 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => navigate("/products")}
                className="text-gray-500 hover:text-blue-600"
              >
                Products
              </button>
              <svg
                className="w-3 h-3 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </li>
            <li className="flex items-center">
              <button
                onClick={() =>
                  navigate(`/products?category=${product.category}`)
                }
                className="text-gray-500 hover:text-blue-600"
              >
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </button>
              <svg
                className="w-3 h-3 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </li>
            <li>
              <span className="text-gray-700 font-medium" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Product Detail View */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images Section */}
            <div className="lg:w-1/2 p-6 flex flex-col">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-[400px] flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Zoom hint */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Thumbnail gallery */}
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(image)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none ${
                        currentImage === image
                          ? "ring-2 ring-blue-500"
                          : "ring-1 ring-gray-200"
                      }`}
                      aria-label={`View image ${index + 1} of product`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 p-8">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {/* Wishlist button */}
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                    aria-label="Add to wishlist"
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center mb-4">
                  <div
                    className="flex"
                    aria-label={`Rating: ${product.rating} out of 5`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={
                          i < Math.floor(product.rating)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-baseline mb-1">
                  {product.discount > 0 && (
                    <>
                      <p className="text-4xl font-bold text-gray-900">
                        {formatPrice(
                          calculateDiscountedPrice(
                            product.price,
                            product.discount
                          )
                        )}
                      </p>
                      <p className="ml-3 text-lg text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                      <span className="ml-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                        SAVE {product.discount}%
                      </span>
                    </>
                  )}

                  {product.discount === 0 && (
                    <p className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        product.inStock ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </div>
                  <div className="ml-3 text-sm text-gray-500">
                    Delivery: {product.deliveryTime}
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Product details/specs */}
                {product.details && product.details.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Key Features
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {product.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Materials */}
                {product.materials && product.materials.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Materials
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Dimensions
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <span className="block text-xs text-gray-500">Width</span>
                      <span className="block font-medium">
                        {product.dimensions.width} cm
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <span className="block text-xs text-gray-500">Depth</span>
                      <span className="block font-medium">
                        {product.dimensions.depth} cm
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <span className="block text-xs text-gray-500">
                        Height
                      </span>
                      <span className="block font-medium">
                        {product.dimensions.height} cm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Available Colors
                  </h3>
                  <div
                    className="flex space-x-3"
                    role="radiogroup"
                    aria-label="Select color"
                  >
                    {product.colors.map((color, index) => {
                      const isSelected = color === selectedColor;
                      return (
                        <button
                          key={index}
                          className={`relative w-10 h-10 rounded-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-blue-500 ${
                            isSelected
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : "ring-1 ring-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select ${color} color`}
                          aria-pressed={isSelected}
                          role="radio"
                        >
                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Quantity
                  </h3>
                  <div className="flex items-center border border-gray-300 rounded-lg w-36">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="px-3 py-2 flex-1 text-center">
                      {quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
                    disabled={!product.inStock}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Proceed to Room
                  </button>

                  <button className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery & Returns Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Delivery & Returns
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Fast Delivery
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  We deliver to Colombo in {product.deliveryTime} and nationwide
                  in 5-10 days.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Free Returns
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Return items within 30 days of delivery for a full refund.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  2 Year Warranty
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  All our furniture comes with a 2-year warranty against
                  manufacturing defects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="relative">
                    {/* Product image */}
                    <div className="h-64 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Discount badge */}
                    {item.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {item.discount}% OFF
                      </div>
                    )}

                    {/* Quick action buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleProductClick(item.id)}
                          className="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200"
                          aria-label={`View details of ${item.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200"
                          aria-label={`Add ${item.name} to wishlist`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200"
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <div
                      onClick={() => handleProductClick(item.id)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>

                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill={
                                i < Math.floor(item.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                              stroke="currentColor"
                              className={`w-4 h-4 ${
                                i < Math.floor(item.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({item.reviews})
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        {item.discount > 0 ? (
                          <div>
                            <span className="font-bold text-gray-900">
                              {formatPrice(
                                calculateDiscountedPrice(
                                  item.price,
                                  item.discount
                                )
                              )}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      {/* Quick add to cart button */}
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                        aria-label={`Quick add ${item.name} to cart`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}

                      {item.inStock ? (
                        <span className="px-2 py-1 bg-green-100 text-xs text-green-800 rounded-full ml-auto">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-xs text-red-800 rounded-full ml-auto">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
