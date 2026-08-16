import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "/dashboard";

        } catch (error) {
            alert("Unable to connect to server");
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">🍕</div>

                <h1>Welcome back</h1>

                <p>Login to continue to PizzaCraft</p>

                <form onSubmit={login}>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <button className="primary-btn">
                        Login
                    </button>

                </form>

                <p className="auth-bottom">
                    Don't have an account?
                    <a href="/register"> Create account</a>
                </p>
                <p className="auth-bottom"><a href="/forgot-password">Forgot password?</a></p>

            </div>

        </div>
    );
}

export default Login;
