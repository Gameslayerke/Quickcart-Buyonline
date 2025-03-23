import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import Homepage from "./Components/Homepage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import AddProduct from "./Components/AddProduct";
import ProductCard from "./Components/ProductCard";
import { AuthProvider } from "./Components/AuthContext";
import { OrdersProvider } from "./Components/OrdersContext";
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";
import Notifications from "./Components/Notifications";
import Offer from "./Components/Offer";
import ProductOfferCard from "./Components/ProductOfferCard";
import Profile from "./Components/Profile";

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/category/:categoryId" element={<Homepage />} /> {/* Add this route */}
              <Route path="/addproducts" element={<AddProduct />} />
              <Route path="/productcard/:id" element={<ProductCard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/offers" element={<Offer />} />
              <Route path="/productoffercard/:id" element={<ProductOfferCard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;