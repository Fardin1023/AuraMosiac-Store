import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../../api/api";
import ProductItem from "../../components/ProductItem";

const CategoryPage = () => {
  const { id } = useParams(); // category id from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsByCategory(id).then((res) => setProducts(res.data));
  }, [id]);

  return (
    <section className="categoryPage">
      <div className="container">
        <h3 className="mb-4">Products</h3>
        <div className="row">
          {products.length > 0 ? (
            products.map((p) => (
              <div className="col-md-3 mb-4" key={p.id}>
                <ProductItem product={p} />
              </div>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
