import { createContext, useContext, useState, useMemo } from "react";

// ─── Raw data ──────────────────────────────────────────────────────────────────
export const SHOES = [
  {
    id: 1,
    name: "Classic Leather Oxford",
    category: "Men's Formal",
    price: 4500,
    originalPrice: 6500,
    rating: 4.8,
    sale: true,
    saleLabel: "31% OFF",
    isNew: false,
    img: "/shoes1.jpg",
    description: "Timeless leather oxfords crafted for the modern gentleman. Full-grain leather upper with a cushioned insole for all-day comfort.",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["#2c1810", "#4a3728", "#8b6f47"],
    colorNames: ["Dark Brown", "Walnut", "Tan"],
    collection: "shoes",
    shippingFee: 200,
  },
  {
    id: 2,
    name: "Strappy Heeled Sandals",
    category: "Women's Heels",
    price: 3200,
    originalPrice: null,
    rating: 4.6,
    sale: false,
    saleLabel: null,
    isNew: true,
    img: "/shoes2.jpg",
    description: "Elegant strappy heels that take you from day to night. Adjustable ankle strap with padded footbed for comfortable wear.",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["#f5e6dc", "#e75480", "#1a1a1a"],
    colorNames: ["Nude", "Pink", "Black"],
    collection: "shoes",
    shippingFee: 0,
  },
  {
    id: 3,
    name: "White Runner Sneakers",
    category: "Unisex Casual",
    price: 2800,
    originalPrice: 3800,
    rating: 4.9,
    sale: true,
    saleLabel: "26% OFF",
    isNew: false,
    img: "/shoes3.jpg",
    description: "Clean minimal runners with breathable mesh upper and lightweight rubber sole. Perfect for everyday street style.",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["#ffffff", "#1a1a1a", "#e75480"],
    colorNames: ["White", "Black", "Pink"],
    collection: "shoes",
    shippingFee: 250,
  },
  {
    id: 4,
    name: "Block Heel Ankle Boots",
    category: "Women's Boots",
    price: 5200,
    originalPrice: 7000,
    rating: 4.7,
    sale: true,
    saleLabel: "26% OFF",
    isNew: false,
    img: "/img 1.jpeg",
    description: "Statement ankle boots with sturdy block heel.",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["#1a1a1a", "#4a3728", "#b5355c"],
    colorNames: ["Black", "Brown", "Burgundy"],
    collection: "shoes",
    shippingFee: 250,
  },
  {
    id: 5,
    name: "Suede Loafers",
    category: "Men's Casual",
    price: 3600,
    originalPrice: null,
    rating: 4.5,
    sale: false,
    saleLabel: null,
    isNew: true,
    img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    description: "Premium suede loafers.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["#8b6f47", "#2c1810", "#4a6fa5"],
    colorNames: ["Tan", "Dark Brown", "Navy"],
    collection: "shoes",
    shippingFee: 250,
  },
  {
    id: 6,
    name: "Flatform Slides",
    category: "Women's Casual",
    price: 1800,
    originalPrice: 2400,
    rating: 4.4,
    sale: true,
    saleLabel: "25% OFF",
    isNew: false,
    img: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600&q=80",
    description: "Chunky flatform slides.",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["#ffffff", "#f5e6dc", "#e75480"],
    colorNames: ["White", "Cream", "Pink"],
    collection: "shoes",
    shippingFee: 250,
  },
];

export const COSMETICS = [
  {
    id: 7,
    name: "Velvet Matte Lipstick",
    category: "Lips",
    price: 850,
    originalPrice: 1200,
    rating: 4.9,
    sale: true,
    saleLabel: "29% OFF",
    isNew: false,
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    description: "Ultra-pigmented matte lipstick with a velvety finish that lasts up to 12 hours. Hydrating formula with vitamin E.",
    sizes: [],
    colors: ["#c0392b", "#e75480", "#8b0000", "#d4796a", "#b5355c"],
    colorNames: ["Ruby Red", "Rose Pink", "Deep Wine", "Coral", "Berry"],
    collection: "cosmetics",
    shippingFee: 150,
  },
  {
    id: 8,
    name: "Glow Serum Foundation",
    category: "Face",
    price: 1400,
    originalPrice: null,
    rating: 4.7,
    sale: false,
    saleLabel: null,
    isNew: true,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    description: "Lightweight serum foundation with SPF 30. Buildable medium coverage with a natural skin-like finish. 24-shade range.",
    sizes: ["30ml"],
    colors: ["#f5deb3", "#d2a679", "#c19a6b", "#8d5524", "#5c3317"],
    colorNames: ["Ivory", "Sand", "Beige", "Caramel", "Espresso"],
    collection: "cosmetics",
    shippingFee: 150,
  },
  {
    id: 9,
    name: "24Hr Waterproof Mascara",
    category: "Eyes",
    price: 720,
    originalPrice: 950,
    rating: 4.8,
    sale: true,
    saleLabel: "24% OFF",
    isNew: false,
    img: "https://images.unsplash.com/photo-1631214499913-f3f5a2920c9e?w=600&q=80",
    description: "Volumising waterproof mascara that lengthens and lifts without clumping. Smudge-proof formula lasts all day.",
    sizes: ["8ml"],
    colors: ["#1a1a1a", "#2c1810"],
    colorNames: ["Black", "Brown Black"],
    collection: "cosmetics",
    shippingFee: 0,
  },
  {
    id: 10,
    name: "Rose Gold Highlight Kit",
    category: "Face",
    price: 1100,
    originalPrice: 1500,
    rating: 4.6,
    sale: true,
    saleLabel: "27% OFF",
    isNew: false,
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    description: "3-pan highlighting palette with rose gold, champagne, and pearl shades.",
    sizes: [],
    colors: ["#e8b4b8", "#f7d794", "#f5f5f5"],
    colorNames: ["Rose Gold", "Champagne", "Pearl"],
    collection: "cosmetics",
    shippingFee: 0,
  },
  {
    id: 11,
    name: "12-Pan Eyeshadow Palette",
    category: "Eyes",
    price: 1650,
    originalPrice: null,
    rating: 4.9,
    sale: false,
    saleLabel: null,
    isNew: true,
    img: "https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&q=80",
    description: "Curated 12-shade palette mixing mattes, shimmer, and glitter.",
    sizes: [],
    colors: [],
    colorNames: [],
    collection: "cosmetics",
    shippingFee: 200,
  },
  {
    id: 12,
    name: "Vitamin C Glow Serum",
    category: "Skin",
    price: 1950,
    originalPrice: 2600,
    rating: 4.8,
    sale: true,
    saleLabel: "25% OFF",
    isNew: false,
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    description: "15% stabilised Vitamin C serum with hyaluronic acid. Brightens dull skin, fades dark spots and boosts collagen over 4 weeks.",
    sizes: ["30ml", "50ml"],
    colors: [],
    colorNames: [],
    collection: "cosmetics",
    shippingFee: 100,
  },
];

export const ALL_PRODUCTS = [...SHOES, ...COSMETICS];

// ─── Context ───────────────────────────────────────────────────────────────────
const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState("all"); // "all" | "shoes" | "cosmetics"
  const [sortBy, setSortBy] = useState("default");           // "default" | "price_asc" | "price_desc" | "rating" | "newest"
  const [filterSale, setFilterSale] = useState(false);
  const [filterFreeShipping, setFilterFreeShipping] = useState(false);

  // ─── Derived / filtered lists ────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS;

    // Collection filter
    if (activeCollection === "shoes")     list = list.filter(p => p.collection === "shoes");
    if (activeCollection === "cosmetics") list = list.filter(p => p.collection === "cosmetics");

    // Sale filter
    if (filterSale) list = list.filter(p => p.sale);

    // Free shipping filter
    if (filterFreeShipping) list = list.filter(p => p.shippingFee === 0);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest")     list = [...list].filter(p => p.isNew).concat([...list].filter(p => !p.isNew));

    return list;
  }, [searchQuery, activeCollection, sortBy, filterSale, filterFreeShipping]);

  // Pre-filtered collections (no search/sort, used by FeaturedProducts tabs)
  const shoes     = SHOES;
  const cosmetics = COSMETICS;

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getProductById  = (id) => ALL_PRODUCTS.find(p => p.id === Number(id)) ?? null;
  const getByCollection = (col) => ALL_PRODUCTS.filter(p => p.collection === col);
  const getSaleProducts = () => ALL_PRODUCTS.filter(p => p.sale);
  const getNewArrivals  = () => ALL_PRODUCTS.filter(p => p.isNew);
  const clearFilters    = () => {
    setSearchQuery("");
    setActiveCollection("all");
    setSortBy("default");
    setFilterSale(false);
    setFilterFreeShipping(false);
  };

  return (
    <ProductContext.Provider value={{
      // raw lists
      shoes,
      cosmetics,
      allProducts: ALL_PRODUCTS,

      // filtered + sorted list (for shop/search pages)
      filteredProducts,

      // filter state + setters
      searchQuery,        setSearchQuery,
      activeCollection,   setActiveCollection,
      sortBy,             setSortBy,
      filterSale,         setFilterSale,
      filterFreeShipping, setFilterFreeShipping,

      // helpers
      getProductById,
      getByCollection,
      getSaleProducts,
      getNewArrivals,
      clearFilters,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);