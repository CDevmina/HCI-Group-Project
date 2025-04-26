import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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

// Categories and colors constants
const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "chairs", name: "Chairs" },
  { id: "tables", name: "Tables" },
  { id: "sofas", name: "Sofas" },
  { id: "beds", name: "Beds" },
];

const COMMON_COLORS = [
  { id: "neutral", hex: "#D7CFC1", name: "Neutral" },
  { id: "black", hex: "#383838", name: "Black" },
  { id: "white", hex: "#F9F9F9", name: "White" },
  { id: "blue", hex: "#496083", name: "Blue" },
  { id: "brown", hex: "#96684A", name: "Brown" },
  { id: "gray", hex: "#4C4C4C", name: "Gray" },
];

// Format price with Sri Lankan Rupee currency
const formatPrice = (price) => {
  return new Intl.NumberFormat("si-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * SearchBar component for filtering products
 */
const SearchBar = ({ searchValue, onSearchChange }) => (
  <div className="relative mr-2">
    <input
      type="text"
      placeholder="Search furniture..."
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      aria-label="Search furniture"
    />
    <div className="absolute left-3 top-2.5 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

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
 * Product detail view component
 */
const ProductDetailView = ({
  product,
  selectedColor,
  onSelectColor,
  onAddToCart,
}) => (
  <div className="flex flex-col md:flex-row">
    <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="max-h-[400px] object-contain"
      />
    </div>

    <div className="md:w-1/2 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
      <StarRating rating={product.rating} />
      <p className="text-3xl font-bold text-gray-900 mb-6">
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
          onSelectColor={onSelectColor}
        />
      </div>

      <button
        onClick={onAddToCart}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
      >
        Add to Cart
      </button>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
        <ProductTags tags={product.tags} />
      </div>
    </div>
  </div>
);

/**
 * Category filter component
 */
const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
    <div
      className="space-y-2"
      role="radiogroup"
      aria-label="Filter by category"
    >
      {categories.map((category) => (
        <div key={category.id} className="flex items-center">
          <input
            id={`category-${category.id}`}
            type="radio"
            name="category"
            checked={activeCategory === category.id}
            onChange={() => onCategoryChange(category.id)}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={category.name}
          />
          <label
            htmlFor={`category-${category.id}`}
            className="ml-3 text-sm text-gray-600"
          >
            {category.name}
          </label>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Price range filter component
 */
const PriceRangeFilter = ({ priceRange, onPriceRangeChange }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Rs. {priceRange[0]}</span>
        <span className="text-sm text-gray-600">Rs. {priceRange[1]}</span>
      </div>
      <input
        type="range"
        min="0"
        max="500000"
        step="25000"
        value={priceRange[1]}
        onChange={(e) =>
          onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
        }
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        aria-label={`Price range: Rs. ${priceRange[0]} to Rs. ${priceRange[1]}`}
      />
    </div>
  </div>
);

/**
 * Colors filter component
 */
const ColorsFilter = ({ colors, activeColors, onToggleColor }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-900 mb-3">Colors</h3>
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by colors"
    >
      {colors.map((color) => (
        <button
          key={color.id}
          className={`w-8 h-8 rounded-full border-2 ${
            activeColors.includes(color.hex)
              ? "border-blue-500"
              : "border-transparent"
          }`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onToggleColor(color.hex)}
          aria-label={`Toggle ${color.name} filter`}
          aria-pressed={activeColors.includes(color.hex)}
          title={color.name}
        />
      ))}
    </div>
  </div>
);

/**
 * Filter sidebar component for desktop
 */
const FilterSidebar = ({
  activeFilters,
  onFilterChange,
  onToggleColor,
  onClearFilters,
}) => (
  <div className="hidden md:block w-64 mr-8">
    <div className="sticky top-6 space-y-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>

      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeFilters.category}
        onCategoryChange={(category) => onFilterChange("category", category)}
      />

      <PriceRangeFilter
        priceRange={activeFilters.priceRange}
        onPriceRangeChange={(range) => onFilterChange("priceRange", range)}
      />

      <ColorsFilter
        colors={COMMON_COLORS}
        activeColors={activeFilters.colors}
        onToggleColor={onToggleColor}
      />

      <button
        onClick={onClearFilters}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

/**
 * Mobile filters component
 */
const MobileFilters = ({
  isOpen,
  onClose,
  activeFilters,
  onFilterChange,
  onToggleColor,
  onClearFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-25"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-xs h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 space-y-6">
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeFilters.category}
            onCategoryChange={(category) =>
              onFilterChange("category", category)
            }
          />

          <PriceRangeFilter
            priceRange={activeFilters.priceRange}
            onPriceRangeChange={(range) => onFilterChange("priceRange", range)}
          />

          <ColorsFilter
            colors={COMMON_COLORS}
            activeColors={activeFilters.colors}
            onToggleColor={onToggleColor}
          />

          <button
            onClick={onClearFilters}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * View toggle component
 */
const ViewToggle = ({ isGridView, onToggleView }) => (
  <div className="flex space-x-2">
    <button
      onClick={() => onToggleView(true)}
      className={`p-2 rounded ${
        isGridView ? "bg-gray-200" : "bg-white hover:bg-gray-100"
      }`}
      aria-label="Grid view"
      aria-pressed={isGridView}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
          clipRule="evenodd"
        />
      </svg>
    </button>
    <button
      onClick={() => onToggleView(false)}
      className={`p-2 rounded ${
        !isGridView ? "bg-gray-200" : "bg-white hover:bg-gray-100"
      }`}
      aria-label="List view"
      aria-pressed={!isGridView}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

/**
 * Grid view item component
 */
const GridViewItem = ({ product, onSelect }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden transform transition-transform duration-200 hover:-translate-y-1">
    <div className="relative h-64 bg-gray-100">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
      <StarRating rating={product.rating} size="sm" />
      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </span>
        <button
          onClick={() => onSelect(product)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
          aria-label={`View details for ${product.name}`}
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

/**
 * List view item component
 */
const ListViewItem = ({ product, onSelect }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden transform transition-transform duration-200 hover:-translate-y-1">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-48 h-48 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {product.name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {product.category}
            </span>
          </div>
          <StarRating rating={product.rating} size="sm" />
          <p className="text-gray-500 text-sm mb-4">{product.description}</p>
          <ProductTags tags={product.tags} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-4">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onSelect(product)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Product list component
 */
const ProductList = ({ products, isGridView, onSelectProduct }) => {
  if (products.length === 0) {
    return (
      <div
        className="bg-white rounded-lg shadow p-8 text-center"
        aria-live="polite"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-12 h-12 mx-auto text-gray-400 mb-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your search or filter criteria
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div
        key={isGridView ? "grid" : "list"}
        className="transition-opacity duration-300"
      >
        {isGridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <GridViewItem
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <ListViewItem
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

/**
 * Main ProductsPage component
 */
const ProductsPage = () => {
  // State management
  const [filteredProducts, setFilteredProducts] = useState(FURNITURE_DATA);
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    priceRange: [0, 500000],
    colors: [],
    search: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Apply filters when activeFilters change
  const applyFilters = useCallback(() => {
    let results = [...FURNITURE_DATA];

    // Category filter
    if (activeFilters.category !== "all") {
      results = results.filter(
        (item) => item.category === activeFilters.category
      );
    }

    // Price range filter
    results = results.filter(
      (item) =>
        item.price >= activeFilters.priceRange[0] &&
        item.price <= activeFilters.priceRange[1]
    );

    // Color filter
    if (activeFilters.colors.length > 0) {
      results = results.filter((item) =>
        item.colors.some((color) => activeFilters.colors.includes(color))
      );
    }

    // Search filter
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredProducts(results);
  }, [activeFilters]);

  // Apply filters when activeFilters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Toggle color selection in filter
  const toggleColorFilter = (color) => {
    setActiveFilters((prev) => {
      const colors = [...prev.colors];
      const index = colors.indexOf(color);

      if (index > -1) {
        colors.splice(index, 1);
      } else {
        colors.push(color);
      }

      return {
        ...prev,
        colors,
      };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      category: "all",
      priceRange: [0, 500000],
      colors: [],
      search: "",
    });
  };

  // Handle selecting a product to view details
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    navigate(`/products/${product.id}`, { replace: true });
  };

  // Handle back to products list
  const handleBackToProducts = () => {
    setSelectedProduct(null);
    navigate("/products", { replace: true });
  };

  // Handle Add to Cart action
  const handleAddToCart = () => {
    // In a real app, this would add the product to the cart
    alert(`Added ${selectedProduct.name} to your cart!`);
  };

  // Simulate loading for better UX
  const simulateLoading = (callback) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Add spacing after navbar */}
      <div className="pt-17"></div>

      {/* Header with search and view options - only show when not in product detail view */}
      {!selectedProduct && (
        <header className="bg-white shadow-sm mb-6">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Furniture Collection
            </h1>

            <div className="flex items-center">
              <SearchBar
                searchValue={activeFilters.search}
                onSearchChange={(value) => handleFilterChange("search", value)}
              />

              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label="Toggle filters"
                aria-expanded={isMobileFiltersOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.879A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <ViewToggle
                isGridView={isGridView}
                onToggleView={setIsGridView}
              />
            </div>
          </div>
        </header>
      )}

      {/* Back button when viewing product details */}
      {selectedProduct && (
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
      )}

      {/* Loading overlay */}
      {loading && <LoadingOverlay />}

      <div className="container mx-auto px-4 py-6">
        {selectedProduct ? (
          /* Product Detail View */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ProductDetailView
              product={selectedProduct}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              onAddToCart={handleAddToCart}
            />
          </div>
        ) : (
          /* Products List View with Filters */
          <div className="flex flex-col md:flex-row">
            {/* Mobile Filters - only visible on mobile when opened */}
            <MobileFilters
              isOpen={isMobileFiltersOpen}
              onClose={() => setIsMobileFiltersOpen(false)}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onToggleColor={toggleColorFilter}
              onClearFilters={clearFilters}
            />

            {/* Desktop Filter Sidebar */}
            <FilterSidebar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onToggleColor={toggleColorFilter}
              onClearFilters={clearFilters}
            />

            {/* Products Grid/List */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>
                <div className="md:hidden">
                  <ViewToggle
                    isGridView={isGridView}
                    onToggleView={setIsGridView}
                  />
                </div>
              </div>

              {/* Product List */}
              <ProductList
                products={filteredProducts}
                isGridView={isGridView}
                onSelectProduct={(product) =>
                  simulateLoading(() => handleSelectProduct(product))
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
