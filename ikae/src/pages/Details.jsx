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
    description:
      "An ergonomic office chair designed for comfort during long work sessions. Features adjustable height, armrests, and lumbar support.",
    dimensions: { width: 60, depth: 65, height: 115 },
    rating: 4.7,
    tags: ["office", "ergonomic", "modern"],
  },
  {
    id: 2,
    name: "Scandinavian Dining Table",
    category: "tables",
    price: 175680,
    colors: ["#96684A", "#4C4C4C", "#D7CFC1"],
    image:
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3",
    description:
      "A minimalist Scandinavian-style dining table made from sustainable oak wood. Perfect for family gatherings.",
    dimensions: { width: 160, depth: 90, height: 75 },
    rating: 4.9,
    tags: ["dining", "scandinavian", "wood"],
  },
  {
    id: 3,
    name: "Modern Sectional Sofa",
    category: "sofas",
    price: 415680,
    colors: ["#383838", "#D7CFC1", "#496083"],
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3",
    description:
      "A spacious and stylish sectional sofa with chaise lounge. Made with high-quality fabric and memory foam cushions.",
    dimensions: { width: 280, depth: 170, height: 85 },
    rating: 4.6,
    tags: ["living room", "modern", "comfortable"],
  },
  {
    id: 4,
    name: "Coffee Table with Storage",
    category: "tables",
    price: 105280,
    colors: ["#96684A", "#383838"],
    image:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3",
    description:
      "A practical coffee table with hidden storage compartments. Modern design with a mix of wood and metal elements.",
    dimensions: { width: 120, depth: 60, height: 40 },
    rating: 4.5,
    tags: ["living room", "storage", "modern"],
  },
  {
    id: 5,
    name: "Accent Armchair",
    category: "chairs",
    price: 143680,
    colors: ["#4F6D8C", "#D7CFC1", "#96684A", "#383838"],
    image:
      "https://images.unsplash.com/photo-1586158291800-2665f07bba79?ixlib=rb-4.0.3",
    description:
      "A comfortable accent armchair perfect for reading corners. Features curved lines and premium upholstery.",
    dimensions: { width: 75, depth: 80, height: 90 },
    rating: 4.8,
    tags: ["living room", "accent", "reading"],
  },
  {
    id: 6,
    name: "Queen Size Bed Frame",
    category: "beds",
    price: 255680,
    colors: ["#96684A", "#383838"],
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3",
    description:
      "A sturdy queen-size bed frame with a padded headboard. Includes under-bed storage drawers.",
    dimensions: { width: 165, depth: 210, height: 110 },
    rating: 4.7,
    tags: ["bedroom", "queen", "storage"],
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

/**
 * Loading overlay component for async operations
 */
const LoadingOverlay = () => (
  <div
    className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
    role="alert"
    aria-live="assertive"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

/**
 * Star rating component
 */
const StarRating = ({ rating, size = "md" }) => {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex items-center">
      <div className="flex" aria-label={`Rating: ${rating} out of 5`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={i < Math.floor(rating) ? "currentColor" : "none"}
            stroke="currentColor"
            className={`${starSize} ${
              i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
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
      <span
        className={`${
          size === "sm" ? "text-xs" : "text-sm"
        } text-gray-500 ml-2`}
      >
        {rating} out of 5
      </span>
    </div>
  );
};

/**
 * Color selector component
 */
const ColorSelector = ({ colors, selectedColor, onSelectColor }) => (
  <div className="flex space-x-2" role="radiogroup" aria-label="Select color">
    {colors.map((color, index) => (
      <button
        key={index}
        className={`w-8 h-8 rounded-full border-2 ${
          color === selectedColor ? "border-blue-500" : "border-transparent"
        }`}
        style={{ backgroundColor: color }}
        onClick={() => onSelectColor(color)}
        aria-label={`Select ${color} color`}
        aria-pressed={color === selectedColor}
        role="radio"
      />
    ))}
  </div>
);

/**
 * Product dimensions component
 */
const ProductDimensions = ({ dimensions }) => (
  <div className="mb-6">
    <h3 className="text-sm font-medium text-gray-900 mb-2">Dimensions</h3>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <span className="block text-xs text-gray-500">Width</span>
        <span className="block font-medium">{dimensions.width} cm</span>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <span className="block text-xs text-gray-500">Depth</span>
        <span className="block font-medium">{dimensions.depth} cm</span>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg text-center">
        <span className="block text-xs text-gray-500">Height</span>
        <span className="block font-medium">{dimensions.height} cm</span>
      </div>
    </div>
  </div>
);

/**
 * Product tags component
 */
const ProductTags = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
      >
        {tag}
      </span>
    ))}
  </div>
);

/**
 * Main ProductDetailPage component
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading product data
    setLoading(true);

    setTimeout(() => {
      // Find product by ID
      const foundProduct = FURNITURE_DATA.find(
        (item) => item.id === parseInt(id)
      );

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]); // Set the first color as default
      } else {
        // If product not found, redirect back to products page
        navigate("/products");
      }

      setLoading(false);
    }, 500);
  }, [id, navigate]);

  // Handle back to products list
  const handleBackToProducts = () => {
    navigate("/products");
  };

  // Handle Add to Cart action
  const handleAddToCart = () => {
    // In a real app, this would add the product to the cart with the selected color
    alert(`Added ${product.name} in color ${selectedColor} to your cart!`);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!product) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Add spacing after navbar */}
      <div className="pt-17"></div>

      {/* Back button */}
      <div className="container mx-auto px-4 py-2">
        <button
          onClick={handleBackToProducts}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-3 py-1.5"
          aria-label="Back to products"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 mr-1"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Product Detail View */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[400px] object-contain"
              />
            </div>

            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <StarRating rating={product.rating} />
              <p className="text-3xl font-bold text-gray-900 my-6">
                {formatPrice(product.price)}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <ProductDimensions dimensions={product.dimensions} />

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Available Colors
                </h3>
                <ColorSelector
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full transition duration-200"
              >
                Add to Cart
              </button>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                <ProductTags tags={product.tags} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
