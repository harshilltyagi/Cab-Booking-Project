import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import supabase from "../../supabase.js";

function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const testBackend = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) return;

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Backend response:", data);
    };

    testBackend();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#2A2A2A]">
        <h1 className="text-2xl font-bold text-[#6C63FF]">Cab Booking</h1>
        <div className="flex items-center gap-4">
          <span className="text-[#A0A0A0] text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="px-8 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-[#6C63FF]">{profile?.name || "Rider"}</span>{" "}
            Hii
          </h2>
          <p className="text-[#A0A0A0]">Where are you going today?</p>
        </div>

        <div className="max-w-2xl bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-[#A0A0A0]">
            Your Account
          </h3>
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              <span className="text-[#A0A0A0]">Name: </span>
              <span>{profile?.name || "Not set"}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#A0A0A0]">Email: </span>
              <span>{user?.email}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#A0A0A0]">Role: </span>
              <span className="text-[#6C63FF] font-semibold capitalize">
                {profile?.role || "rider"}
              </span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6">Book a Ride</h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#A0A0A0]">Pickup Location</label>
              <input
                type="text"
                placeholder="Enter pickup location"
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#A0A0A0]">Dropoff Location</label>
              <input
                type="text"
                placeholder="Enter dropoff location"
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
              />
            </div>

            <button className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 cursor-pointer">
              Find a Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
