import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import supabase from "../../supabase.js";

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#6C63FF] mb-2">Cab Booking</h1>
        <h2 className="text-xl font-semibold mb-1">Welcome Back</h2>
        <p className="text-[#A0A0A0] text-sm mb-8">
          Login to continue booking rides
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#A0A0A0]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#A0A0A0]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#6C63FF] hover:bg-[#5a52d5] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-[#A0A0A0] text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#6C63FF] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
