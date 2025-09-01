import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import ProductItem from "../ProductItem";

const RecommendedProducts = ({ currentProduct }) => {
  const context = useContext(MyContext);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!currentProduct || !context.products) return;

    // ✅ simple rule: same category, exclude current product
    const related = context.products.filter(
      (p) =>
        p.category === currentProduct.category &&
        p.id !== currentProduct.id
    );

    setRecommended(related.slice(0, 4)); // limit to 4
  }, [currentProduct, context.products]);

  if (recommended.length === 0) return null;

  return (
    <div className="recommended-products mt-4">
      <h5>You may also like</h5>
      <div className="d-flex flex-wrap">
        {recommended.map((item) => (
          <div key={item.id} style={{ flex: "0 0 25%" }}>
            <ProductItem product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
