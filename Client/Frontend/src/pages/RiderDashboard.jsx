import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import MapView from "../components/MapView";
import { API_BASE } from "../config";

function RiderDashboard() {
  const { session, user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const token = session?.access_token;

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const [myRides, setMyRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const [creating, setCreating] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMyRides = async () => {
    if (!token) return;

    setLoadingRides(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/rides/my-rides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMyRides(data.rides || []);
      } else {
        setError(data.error || "Failed to fetch rides");
      }
    } catch (err) {
      setError("Network error while fetching rides");
      console.log(err);
    } finally {
      setLoadingRides(false);
    }
  };

  const createRide = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!pickup.trim() || !dropoff.trim()) {
      setError("Pickup and Dropoff are required");
      return;
    }

    if (!token) return;

    setCreating(true);

    try {
      const res = await fetch(`${API_BASE}/api/rides`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickup, dropoff }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Ride requested successfully");
        setPickup("");
        setDropoff("");
        fetchMyRides();
      } else {
        setError(data.error || "Ride request failed");
      }
    } catch (err) {
      setError("Network error while creating ride");
      console.log(err);
    } finally {
      setCreating(false);
    }
  };

  const payRideWithRazorpay = async (ride) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/rides/${ride.id}/razorpay-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create payment order");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Cab Booking",
        description: `Ride Payment: ${ride.pickup} → ${ride.dropoff}`,
        order_id: data.orderId,
        prefill: {
          email: data.riderEmail,
        },
        theme: {
          color: "#6C63FF",
        },
        handler: async function () {
          const payRes = await fetch(`${API_BASE}/api/rides/${ride.id}/pay`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const payData = await payRes.json();

          if (payRes.ok) {
            alert("Payment successful");
            fetchMyRides();
          } else {
            alert(payData.error || "Failed to mark payment");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log("Razorpay payment error:", err);
      alert("Network error");
    }
  };

  const submitReview = async (rideId) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ride_id: rideId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted");
        fetchMyRides();
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.log(err);
      alert("Network error");
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const getStatusMessage = (status) => {
    if (status === "requested") return "Looking for a driver...";
    if (status === "accepted") return "Driver accepted your ride";
    if (status === "arrived") return "Driver has arrived";
    if (status === "started") return "Ride is in progress";
    if (status === "completed") return "Ride completed successfully";
    if (status === "cancelled") return "Ride cancelled";
    return "Status updated";
  };

  const getStatusClasses = (status) => {
    if (status === "requested") {
      return "text-gray-300 border-gray-500 bg-gray-500/10";
    }
    if (status === "accepted") {
      return "text-blue-300 border-blue-500 bg-blue-500/10";
    }
    if (status === "arrived") {
      return "text-yellow-300 border-yellow-500 bg-yellow-500/10";
    }
    if (status === "started") {
      return "text-purple-300 border-purple-500 bg-purple-500/10";
    }
    if (status === "completed") {
      return "text-green-300 border-green-500 bg-green-500/10";
    }
    if (status === "cancelled") {
      return "text-red-300 border-red-500 bg-red-500/10";
    }

    return "text-[#A0A0A0] border-[#2A2A2A]";
  };

  useEffect(() => {
    if (!user?.id || !token) return;
    fetchMyRides();
  }, [user?.id, token]);

  const pickupCoords = [28.6139, 77.209];
  const dropoffCoords = [26.9124, 75.7873];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#2A2A2A]">
        <h1 className="text-xl font-bold text-[#6C63FF]">Cab Booking Rider</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#A0A0A0]">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="px-8 py-10 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">
          Welcome,{" "}
          <span className="text-[#6C63FF]">{profile?.name || "Rider"}</span>
        </h2>
        <p className="text-[#A0A0A0] mb-8">Book a ride and track it below.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 mb-10">
          <h3 className="text-xl font-semibold mb-6">Book a Ride</h3>

          <form onSubmit={createRide} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#A0A0A0]">Pickup Location</label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Airport"
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#A0A0A0]">Dropoff Location</label>
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Mall"
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#6C63FF] transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-[#6C63FF] hover:bg-[#5a52d5] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2 cursor-pointer"
            >
              {creating ? "Requesting..." : "Find a Ride"}
            </button>
          </form>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">My Rides</h3>

            <button
              onClick={fetchMyRides}
              className="text-sm text-[#6C63FF] hover:underline"
              disabled={loadingRides}
            >
              {loadingRides ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loadingRides ? (
            <p className="text-[#A0A0A0]">Loading rides...</p>
          ) : myRides.length === 0 ? (
            <p className="text-[#A0A0A0]">No rides yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {myRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl p-5"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {ride.pickup} → {ride.dropoff}
                    </p>

                    <span
                      className={`text-xs px-3 py-1 rounded-full border capitalize ${getStatusClasses(
                        ride.status,
                      )}`}
                    >
                      {ride.status}
                    </span>
                  </div>

                  <p className="text-sm text-[#A0A0A0] mt-3">
                    {getStatusMessage(ride.status)}
                  </p>

                  {ride.status === "completed" &&
                    ride.payment_status === "pending" && (
                      <button
                        onClick={() => payRideWithRazorpay(ride)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mt-3"
                      >
                        Pay Now
                      </button>
                    )}

                  {ride.payment_status === "paid" && (
                    <p className="text-green-400 mt-3 font-semibold">
                      Payment completed
                    </p>
                  )}

                  <p className="text-sm text-green-400 mt-2">
                    Fare: {ride.fare || 0}
                  </p>

                  <p className="text-xs text-[#A0A0A0] mt-2">
                    Ride ID: {ride.id}
                  </p>

                  {ride.status === "completed" &&
                    ride.payment_status === "paid" && (
                      <div className="mt-4 flex gap-2 items-center">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="bg-[#1E1E1E] border border-[#2A2A2A] px-2 py-1 rounded w-16"
                        />

                        <input
                          type="text"
                          placeholder="Comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="bg-[#1E1E1E] border border-[#2A2A2A] px-2 py-1 rounded"
                        />

                        <button
                          onClick={() => submitReview(ride.id)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded"
                        >
                          Review
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <MapView pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      </div>
    </div>
  );
}

export default RiderDashboard;
