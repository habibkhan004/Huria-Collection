import React, { useState, useMemo } from "react";
import { useProducts } from "../context/ProductContext";
import { Trash2, Edit, UploadCloud } from "lucide-react";

const C = {
  pink: "#e75480",
  pinkDark: "#b5355c",
  pinkLight: "#f4a7b9",
  cream: "#fff8f2",
  creamDeep: "#ecddc8",
  text: "#3b1f2b",
  textMid: "#7a4058",
  white: "#ffffff",
};

const SHOE_SIZES = ["36","37","38","39","40","41","42","43","44"];
const COSMETIC_SIZES = ["10ml","20ml","30ml","50ml","100ml"];
const SHOE_CATEGORIES = ["Men's Formal","Men's Casual","Women's Heels","Women's Boots","Unisex Casual"];
const COSMETIC_CATEGORIES = ["Face","Eyes","Lips","Skin","Hair"];

const COLOR_OPTIONS = [
  { name: "Black",       value: "#000000" },
  { name: "White",       value: "#ffffff" },
  { name: "Beige",       value: "#f5e6dc" },
  { name: "Brown",       value: "#5a3825" },
  { name: "Navy",        value: "#1b2a4a" },
  { name: "Red",         value: "#e53935" },
  { name: "Pink",        value: "#e75480" },
  { name: "Gold",        value: "#d4af37" },
  { name: "Silver",      value: "#c0c0c0" },
  { name: "Grey",        value: "#808080" },
  { name: "Green",       value: "#2e7d32" },
  { name: "Blue",        value: "#1976d2" },
];

export default function ProductManager({ mode = "manage" }) {
  const { filteredProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [search, setSearch] = useState("");
  const [type, setType] = useState("shoes"); // shoes or cosmetics
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    sale: false,
    saleLabel: "",
    isNew: false,
    freeShipping: false,
    img: "",
    file: null,
    description: "",
    sizes: [],
    colors: [],
    colorNames: [],
    collection: "shoes",
    shippingFee: "",
  });

  // ─── Filtered Products ─────────────────────────────────────
  const filtered = useMemo(() => {
    return filteredProducts
      .filter(p => p.collection === type)
      .filter(p => {
        const q = search.toLowerCase();
        return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      });
  }, [search, type, filteredProducts]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleChange = e => {
    const { name, value, type: t, checked, files } = e.target;

    if (name === "img" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () =>
        setForm(f => ({ ...f, img: reader.result, file }));
      reader.readAsDataURL(file);
      return;
    }

    setForm(f => ({ ...f, [name]: t==="checkbox" ? checked : value }));
  };

  const toggleSize = size => {
    setForm(f => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter(s=>s!==size) : [...f.sizes, size] }));
  };

  const toggleColorOption = (value, name) => {
    setForm(f => {
      const idx = f.colors.indexOf(value);
      if (idx === -1) {
        return {
          ...f,
          colors:     [...f.colors, value],
          colorNames: [...f.colorNames, name],
        };
      }
      const colors = [...f.colors];
      const names  = [...f.colorNames];
      colors.splice(idx, 1);
      names.splice(idx, 1);
      return { ...f, colors, colorNames: names };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const shippingFeeValue = form.freeShipping
      ? 0
      : form.shippingFee !== "" ? Number(form.shippingFee) : 0;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("originalPrice", form.originalPrice || "");
    fd.append("sale", form.sale);
    fd.append("saleLabel", form.saleLabel);
    fd.append("isNew", form.isNew);
    fd.append("description", form.description);
    fd.append("collection", type);
    fd.append("shippingFee", shippingFeeValue);
    fd.append("sizes", JSON.stringify(form.sizes || []));
    fd.append("colors", JSON.stringify(form.colors || []));
    fd.append("colorNames", JSON.stringify(form.colorNames || []));

    if (form.file) {
      fd.append("img", form.file);
    }

    if (form.id) {
      await updateProduct(form.id, fd);
    } else {
      await addProduct(fd);
    }

    // reset
    setForm({
      id: null,
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      sale: false,
      saleLabel: "",
      isNew: false,
      freeShipping: false,
      img: "",
      file: null,
      description: "",
      sizes: [],
      colors: [],
      colorNames: [],
      collection: type,
      shippingFee: "",
    });
  };

  const editProduct = p => setForm({
    id: p._id,
    name: p.name || "",
    category: p.category || "",
    price: p.price?.toString() || "",
    originalPrice: p.originalPrice?.toString() || "",
    sale: !!p.sale,
    saleLabel: p.saleLabel || "",
    isNew: !!p.isNew,
    freeShipping: p.shippingFee === 0,
    img: p.img || "",
    file: null,
    description: p.description || "",
    sizes: [...(p.sizes || [])],
    colors: [...(p.colors || [])],
    colorNames: [...(p.colorNames || [])],
    collection: p.collection || type,
    shippingFee: p.shippingFee?.toString() || "",
  });

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 space-y-6">
      {/* Header + collection switch */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-widest uppercase" style={{ color: C.text }}>
            Product Manager
          </h2>
          <p className="text-xs md:text-sm mt-1" style={{ color: C.textMid }}>
            Add or edit products and manage your Huria Collections inventory.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink focus:border-pink"
            style={{ borderColor: C.creamDeep }}
          >
            <option value="shoes">Shoes</option>
            <option value="cosmetics">Cosmetics</option>
          </select>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-pink focus:border-pink"
            style={{ borderColor: C.creamDeep }}
          />
        </div>
      </div>

      {/* Layout: for add page center the form at 90% width, for manage use two-column grid */}
      <div
        className={
          mode === "add"
            ? "flex justify-center"
            : form.id
            ? "grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] items-start"
            : "block"
        }
      >
        {/* Add / Edit form card */}
        {(mode === "add" || (mode === "manage" && form.id)) && (
        <form
          onSubmit={handleSubmit}
          className={`grid gap-4 p-5 md:p-6 bg-cream rounded-xl shadow-sm ${
            mode === "add" ? "w-[90%]" : ""
          }`}
        >
  {/* Name */}
  <input
    name="name"
    placeholder="Name"
    value={form.name}
    onChange={handleChange}
    className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
  />

  {/* Category */}
  <select
    name="category"
    value={form.category}
    onChange={handleChange}
    className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
  >
    <option value="">Select Category</option>
    {(type === "shoes" ? SHOE_CATEGORIES : COSMETIC_CATEGORIES).map(c => (
      <option key={c}>{c}</option>
    ))}
  </select>

  {/* Price & Original Price */}
  <input
    name="price"
    type="number"
    placeholder="Price"
    value={form.price}
    onChange={handleChange}
    className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
  />
  <input
    name="originalPrice"
    type="number"
    placeholder="Original Price"
    value={form.originalPrice}
    onChange={handleChange}
    className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
  />

  {/* Shipping Fee */}
  <input
    name="shippingFee"
    type="number"
    placeholder="Shipping Fee"
    value={form.shippingFee}
    onChange={handleChange}
    className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
  />

  {/* Checkboxes */}
  <div className="flex gap-4 flex-wrap">
    <label className="flex items-center gap-2">
      <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} className="accent-pink" />
      Sale
    </label>
    <input
      name="saleLabel"
      placeholder="Sale Label"
      value={form.saleLabel}
      onChange={handleChange}
      className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
    />
    <label className="flex items-center gap-2">
      <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="accent-pink" />
      New
    </label>
    <label className="flex items-center gap-2">
      <input type="checkbox" name="freeShipping" checked={form.freeShipping} onChange={handleChange} className="accent-pink" />
      Free Delivery
    </label>
  </div>

  {/* Sizes Picker (Shoes & Cosmetics) */}
  <div className="space-y-1">
    <p className="text-xs font-semibold tracking-wide text-textMid uppercase">
      Sizes {type === "cosmetics" && "(ml)"}
    </p>
    <div className="flex flex-wrap gap-2 mt-1">
      {(type === "shoes" ? SHOE_SIZES : COSMETIC_SIZES).map(s => {
        const selected = form.sizes.includes(s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => toggleSize(s)}
            className={`px-2 py-1 text-xs rounded-md border transition-colors ${
              selected
                ? "bg-black text-white border-black"
                : "bg-white text-textMid border-creamDeep hover:border-pink hover:text-pink"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  </div>

  {/* Colors Picker */}
  <div className="space-y-1">
    <p className="text-xs font-semibold tracking-wide text-textMid uppercase">Colors</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
      {COLOR_OPTIONS.map(({ name, value }) => {
        const selected = form.colors.includes(value);
        return (
          <label
            key={value}
            className={`flex items-center justify-between px-2 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
              selected
                ? "bg-black text-white border-black"
                : "bg-white text-textMid border-creamDeep hover:border-pink hover:text-pink"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-sm border border-creamDeep"
                style={{ backgroundColor: value }}
              />
              <span>{name}</span>
            </span>
            <input
              type="checkbox"
              className="accent-pink"
              checked={selected}
              onChange={() => toggleColorOption(value, name)}
            />
          </label>
        );
      })}
    </div>
  </div>

  {/* Description */}
  <input
    name="description"
    placeholder="Description"
    value={form.description}
    onChange={handleChange}
    className="p-2 border border-creamDeep rounded-md outline-none focus:ring-2 focus:ring-pink focus:border-pink"
  />

  {/* Image Upload + Preview */}
  <div className="flex items-center gap-4">
    <label className="flex items-center gap-2 cursor-pointer p-2 border-2 border-dashed border-pink rounded-md bg-white">
      Upload Image
      <input type="file" name="img" accept="image/*" onChange={handleChange} className="hidden" />
    </label>
    {form.img && (
      <div className="w-20 h-20 rounded-md overflow-hidden border border-creamDeep">
        <img
          src={form.img}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="py-2 bg-pink-500 text-white rounded-md font-bold hover:bg-pink-600 transition-colors"
          >
            {form.id && mode === "manage" ? "Update Product" : "Add Product"}
          </button>
        </form>
        )}

        {/* All products list card (hidden on pure add page) */}
        {mode !== "add" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: C.textMid }}>
              {type === "shoes" ? "Shoes" : "Cosmetics"} — All Products
            </h3>
            <span className="text-xs font-semibold" style={{ color: C.textMid }}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map(p => (
              <div
                key={p._id}
                className="rounded-xl overflow-hidden shadow-sm border"
                style={{ background: C.white, borderColor: C.creamDeep }}
              >
                <div className="w-full aspect-square overflow-hidden">
                  {p.img && (
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2.5 flex flex-col gap-1">
                  <strong className="text-xs font-semibold truncate">{p.name}</strong>
                  <span className="text-[11px] truncate" style={{ color: C.textMid }}>
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="font-bold" style={{ color: C.pink }}>
                      PKR {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="line-through text-[10px]" style={{ color: C.textMid }}>
                        {p.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {p.sale && (
                      <span className="px-1.5 py-[1px] rounded-full font-semibold" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                        Sale
                      </span>
                    )}
                    {p.isNew && (
                      <span className="px-1.5 py-[1px] rounded-full font-semibold" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                        New
                      </span>
                    )}
                    {p.shippingFee === 0 && (
                      <span className="px-1.5 py-[1px] rounded-full font-semibold" style={{ background: "#dcfce7", color: "#15803d" }}>
                        Free Delivery
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 border-t" style={{ borderColor: C.creamDeep }}>
                  <button
                    onClick={() => editProduct(p)}
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: C.pinkDark }}
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this product? This action cannot be undone.")) {
                        deleteProduct(p._id);
                      }
                    }}
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: "#b91c1c" }}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}
      </div>
    </div>
  );
}