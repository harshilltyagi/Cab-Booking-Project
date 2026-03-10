import cabimage from "../assets/cabz.png";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";

function Landing() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold text-[#6C63FF]">Cab Booking</h1>
        <div className="flex gap-4">
          <Link to="/Login">
            <button className=" bg-[#6C63FF] text-white px-5 py-2 rounded-xl hover:bg-[#6C63FF] transition-all duration-300">
              Login
            </button>
          </Link>
          <Link to="/Signup">
            <button className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white px-5 py-2 rounded-xl transition-all duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] px-8 items-center gap-10">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Your Ride, <span className="text-[#6C63FF]">Your Way</span>
          </h1>
          <p className="text-[#A0A0A0] text-lg leading-relaxed">
            Book a ride in seconds. Fast, safe and affordable cab booking at
            your fingertips.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/Login">
              <button className="bg-[#6C63FF] hover:bg-[#5a52d5] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300">
                Book a Ride
              </button>
            </Link>
            <button className="border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex items-center justify-center">
          <div className="w-full h-[400px] bg-[#ffffff] rounded-2xl border border-[#2A2A2A] flex items-center justify-center">
            <p className="text-[#A0A0A0]">
              <img src={cabimage} alt="" className=""></img>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
