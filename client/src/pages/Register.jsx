import { useState } from "react";

function Register() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const register = async (e) => {

        e.preventDefault();

        if (form.password.length < 8) {
            alert("Password must contain at least 8 characters");
            return;
        }

        if (!/\d/.test(form.password)) {
            alert("Password must contain at least one number");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Registration successful");

            window.location.href = "/login";

        } catch (error) {
            alert("Unable to connect to server");
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">🍕</div>

                <h1>Create account</h1>

                <p>Join PizzaCraft and build your perfect pizza.</p>

                <form onSubmit={register}>

                    <label>Name</label>

                    <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e =>
                            setForm({ ...form, name: e.target.value })
                        }
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Your email"
                        value={form.email}
                        onChange={e =>
                            setForm({ ...form, email: e.target.value })
                        }
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={e =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                    />

                    <button className="primary-btn">
                        Create Account
                    </button>

                </form>

                <p className="auth-bottom">
                    Already have an account?
                    <a href="/login"> Login</a>
                </p>

            </div>

        </div>
    );
}

export default Register;