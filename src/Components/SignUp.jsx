import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
const SignUp = () => {
    
    let [username, setUsername] = useState("");
    let [email, setEmail] = useState("");
    let [phone, setPhone] = useState("");
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false); 
    let [success, setSuccess] = useState("");
    let [error, setError] = useState("");

    const navigate = useNavigate(); 

    const submitForm = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        if (!email || !phone || !password || !username) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true); 

            const userData = {
                username: username,
                email: email,
                phone: phone,
                password: password
            };

            const response = await axios.post("https://alvins.pythonanywhere.com/api/signup", userData);

            setLoading(false); 
            setSuccess(response.data.message || "User registered successfully!"); 

            setUsername("");
            setEmail("");
            setPhone("");
            setPassword("");

            navigate("/Signin"); 

        } catch (error) {
            setLoading(false); 
            setError(error.response?.data?.error || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-6 card shadow p-4">
                <h2>Sign Up</h2>

                {}
                <div className="text-warning">{loading && <span>Loading...</span>}</div>
                <div className="text-success">{success}</div>
                <div className="text-danger">{error}</div>

                {}
                <form onSubmit={submitForm}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Username" 
                        required 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <br />

                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter Email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <br />

                    <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="Enter Phone No." 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)} 
                    />
                    <br />

                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Enter Password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <br />
                    
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {}
                <p>
                  Already have an account? <Link to="/signin">Sign in</Link>
                </p>

            </div>
        </div>
    );
};

export default SignUp;
