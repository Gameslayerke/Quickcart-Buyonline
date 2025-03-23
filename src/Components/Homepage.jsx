import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "./Carousel";
import "../index.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const img_url = "https://alvins.pythonanywhere.com/static/images/";

  // Wrap fetchProducts in useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let url = "https://alvins.pythonanywhere.com/api/getproducts";
      if (categoryId) {
        url = `https://alvins.pythonanywhere.com/api/getproducts?category_id=${categoryId}`;
      }

      const { data } = await axios.get(url);
      console.log("API Response:", data);

      const formattedProducts = data.map((product) => ({
        ...product,
        product_photo: product.product_photo
          ? `${img_url}${product.product_photo}`
          : `${img_url}placeholder.jpg`,
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]); // Add categoryId as a dependency

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Add fetchProducts to the dependency array

  const filteredProducts = products.filter((product) =>
    product?.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    navigate(`/productcard/${product.id}`, { state: { product } });
  };

  const handleAddToCart = async (product) => {
    const user_id = localStorage.getItem("user_id");
    const total_price = product.product_cost * 1;

    if (!user_id) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const response = await axios.post("https://alvins.pythonanywhere.com/api/orders", {
        user_id,
        product_id: product.id,
        quantity: 1,
        total_price,
        order_status: "pending",
      });

      if (response.status === 201) {
        alert("Product added to cart successfully!");
      } else {
        alert("Failed to add product to cart. Please try again.");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.error || "An error occurred"}`);
    }
  };

  const carouselImages = ["/carousel2.jpeg", "/carousel3.jpg", "/carousel4.avif"];

  return (
    <div className="homepage-container">
      <div className="carousel-section">
        <Carousel images={carouselImages} />
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className="loading-message">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.product_photo}
              className="product-img"
              alt={product.product_name}
              onError={(e) => (e.target.src = `${img_url}placeholder.jpg`)}
            />
            <div className="product-card-body">
              <h5 className="product-name">{product.product_name}</h5>
              <div className="product-price">KSh {product.product_cost}</div>
              <div className="product-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Product ${product.id} liked`);
                  }}
                >
                  ❤️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  🛒
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Product ${product.id} added to wishlist`);
                  }}
                >
                  ⭐
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;