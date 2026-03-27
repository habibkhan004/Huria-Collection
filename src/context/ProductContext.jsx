import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "https://huriacollection.com/api" });

const ProductContext = createContext(null);

export function ProductProvider({ children }) {

  // ─── Server state ────────────────────────────────────────────────────────────
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ─── Filter / sort state (mirrors old context) ───────────────────────────────
  const [searchQuery,        setSearchQuery]        = useState("");
  const [activeCollection,   setActiveCollection]   = useState("all");
  const [sortBy,             setSortBy]             = useState("default");
  const [filterSale,         setFilterSale]         = useState(false);
  const [filterFreeShipping, setFilterFreeShipping] = useState(false);

  // ══════════════════════════════════════════════════════════════════════
  // FETCH all products from backend on mount
  // ══════════════════════════════════════════════════════════════════════
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/products", { params: { limit: 100 } });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ══════════════════════════════════════════════════════════════════════
  // CLIENT-SIDE filter + sort (same logic as before — instant UI response)
  // ══════════════════════════════════════════════════════════════════════
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCollection === "shoes")     list = list.filter(p => p.collection === "shoes");
    if (activeCollection === "cosmetics") list = list.filter(p => p.collection === "cosmetics");
    if (filterSale)                       list = list.filter(p => p.sale);
    if (filterFreeShipping)               list = list.filter(p => p.shippingFee === 0);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest")     list = [...list].filter(p => p.isNew).concat([...list].filter(p => !p.isNew));

    return list;
  }, [products, searchQuery, activeCollection, sortBy, filterSale, filterFreeShipping]);

  // ── Derived lists ──────────────────────────────────────────────────────────
  const shoes     = useMemo(() => products.filter(p => p.collection === "shoes"),     [products]);
  const cosmetics = useMemo(() => products.filter(p => p.collection === "cosmetics"), [products]);

  // ══════════════════════════════════════════════════════════════════════
  // HELPERS (now hit the DB)
  // ══════════════════════════════════════════════════════════════════════
  const getProductById = useCallback(async (id) => {
    try {
      const { data } = await API.get(`/products/${id}`);
      return data.product;
    } catch {
      return null;
    }
  }, []);

  const getByCollection = (col) => products.filter(p => p.collection === col);
  const getSaleProducts  = ()    => products.filter(p => p.sale);
  const getNewArrivals   = ()    => products.filter(p => p.isNew);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCollection("all");
    setSortBy("default");
    setFilterSale(false);
    setFilterFreeShipping(false);
  };

  // ══════════════════════════════════════════════════════════════════════
  // CRUD — calls API then refreshes local state
  // ══════════════════════════════════════════════════════════════════════

  // addProduct — expects FormData (because of image upload)
  const addProduct = useCallback(async (formData) => {
    try {
      const { data } = await API.post("/products", formData);
      setProducts(prev => [...prev, data.product]);
      return { success: true, product: data.product };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to add product" };
    }
  }, []);

  // updateProduct — expects FormData
  const updateProduct = useCallback(async (id, formData) => {
    try {
      const { data } = await API.put(`/products/${id}`, formData);
      setProducts(prev => prev.map(p => p._id === id ? data.product : p));
      return { success: true, product: data.product };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update product" };
    }
  }, []);

  // deleteProduct
  const deleteProduct = useCallback(async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete product" };
    }
  }, []);

  return (
    <ProductContext.Provider value={{
      // data
      products,
      shoes,
      cosmetics,
      allProducts:    products,
      filteredProducts,

      // loading / error
      loading,
      error,
      refetch: fetchProducts,

      // filter state
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

      // CRUD
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);