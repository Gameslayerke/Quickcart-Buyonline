import React, { useState } from "react";

const AddProduct = () => {
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productCost, setProductCost] = useState("");
    const [productPhoto, setProductPhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_name", productName);
        formData.append("product_desc", productDesc);
        formData.append("product_cost", productCost);
        formData.append("product_photo", productPhoto);

        try {
            const response = await fetch("https://alvins.pythonanywhere.com/api/products", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message); 
                setError(""); 
            } else {
                setError(data.error);
                setMessage(""); 
            }
        } catch (err) {
            setError("An error occurred while adding the product.");
            setMessage(""); 
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Add a New Product</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="productDesc">Product Description</label>
                    <textarea
                        className="form-control"
                        id="productDesc"
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="productCost">Product Cost (Ksh)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="productCost"
                        value={productCost}
                        onChange={(e) => setProductCost(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="productPhoto">Product Photo</label>
                    <input
                        type="file"
                        className="form-control"
                        id="productPhoto"
                        onChange={(e) => setProductPhoto(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Add Product
                </button>
            </form>

            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default AddProduct;
