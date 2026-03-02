import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/ProductsGrid";

export default function Cosmetics() {
  const { cosmetics } = useProducts();
  return (
    <ProductGrid
      products={cosmetics}
      accentLabel="✦ Beauty Essentials"
      title="Makeup & Skincare"
      subtitle="Luxury beauty picks — lips, face, eyes & skin all in one place."
      emptyMsg="No cosmetics match your search. Try clearing filters."
    />
  );
}