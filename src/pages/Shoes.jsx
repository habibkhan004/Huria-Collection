import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/ProductsGrid";

export default function Shoes() {
  const { shoes } = useProducts();
  return (
    <ProductGrid
      products={shoes}
      accentLabel="✦ Step Into Style"
      title="Women's & Men's Shoes"
      subtitle="From heels to sneakers — handpicked footwear for every occasion."
      emptyMsg="No shoes match your search. Try clearing filters."
    />
  );
}