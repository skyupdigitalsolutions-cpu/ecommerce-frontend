import { Link } from "react-router-dom";
import { sellingPrice, formatINR } from "../utils/pricing";

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url;
  const price = sellingPrice(product);
  const hasDiscount = product.discount > 0;

  return (
    <Link to={`/product/${product._id}`} className="card product-card">
      <div className="product-thumb">
        {img ? <img src={img} alt={product.name} loading="lazy" /> : <span className="ph">NO IMAGE</span>}
      </div>
      <div className="product-body">
        {product.category?.name && <span className="product-cat">{product.category.name}</span>}
        <span className="product-title">{product.name}</span>
        <div className="price-row">
          <span className="price">{formatINR(price)}</span>
          {hasDiscount && (
            <>
              <span className="price-old">{formatINR(product.price)}</span>
              <span className="tag-off">-{product.discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
