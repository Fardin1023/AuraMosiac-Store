import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery().get("q") || "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      axios
        .get(`/api/products/search?name=${encodeURIComponent(query)}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error(err));
    }
  }, [query]);

  return (
    <div className="search-results container">
      <h2>
        Search Results for: <span className="highlight">{query}</span>
      </h2>

      {products.length > 0 ? (
        <div className="results-grid">
          {products.map((p) => (
            <div key={p._id} className="result-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>৳{p.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
