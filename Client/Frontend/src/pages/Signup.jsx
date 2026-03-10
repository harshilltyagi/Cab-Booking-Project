import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabase.js";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("Profiles").insert({
      id: data.user.id,
      name: name,
      email: email,
      role: "rider",
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#6C63FF] mb-2">Cab Booking</h1>
        <h2 className="text-xl font-semibold mb-1">Create Account</h2>
        <p className="text-[#A0A0A0] text-sm mb-8">
          Start Your Journey with us
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#A0A0A0]">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#A0A0A0]">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#A0A0A0]">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#6C63FF] hover:bg-[#5a52d5] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[#A0A0A0] text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6C63FF] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
