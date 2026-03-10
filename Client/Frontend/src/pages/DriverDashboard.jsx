import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { API_BASE } from "../config";
function DriverDashboard() {
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();
  const token = session?.access_token;

  const [availableRides, setAvailableRides] = useState([]);
  const [assignedRides, setAssignedRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableRides = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/rides/available`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setAvailableRides(data.rides || []);
      } else {
        console.log(data.error);
      }
    } catch (err) {
      console.log("Fetch available error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedRides = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/rides/my-assigned`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setAssignedRides(data.rides || []);
      } else {
        console.log(data.error);
      }
    } catch (err) {
      console.log("Assigned ride error:", err);
    }
  };

  const acceptRide = async (rideId) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/rides/${rideId}/accept`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Ride accepted");
        fetchAvailableRides();
        fetchAssignedRides();
      } else {
        alert(data.error || "Failed to accept ride");
      }
    } catch (err) {
      console.log("Accept error:", err);
      alert("Network error");
    }
  };

  const updateRideStatus = async (rideId, action) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/rides/${rideId}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Ride updated");
        fetchAvailableRides();
        fetchAssignedRides();
      } else {
        alert(data.error || "Failed to update ride");
      }
    } catch (err) {
      console.log("Lifecycle update error:", err);
      alert("Network error");
    }
  };

  const arriveRide = (rideId) => updateRideStatus(rideId, "arrived");
  const startRideAction = (rideId) => updateRideStatus(rideId, "start");
  const completeRideAction = (rideId) => updateRideStatus(rideId, "complete");

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!user?.id || !token) return;

    fetchAvailableRides();
    fetchAssignedRides();
  }, [user?.id, token]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="flex justify-between px-8 py-5 border-b border-[#2A2A2A]">
        <h1 className="text-xl font-bold text-[#6C63FF]">Cab Booking Driver</h1>

        <div className="flex gap-4 items-center">
          <span className="text-sm text-[#A0A0A0]">{user?.email}</span>

          <button
            onClick={handleLogout}
            className="border border-[#6C63FF] px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Available Rides</h2>

          <button
            onClick={() => {
              fetchAvailableRides();
              fetchAssignedRides();
            }}
            className="text-sm text-[#6C63FF] hover:underline"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && <p>Loading rides...</p>}

        {availableRides.length === 0 && !loading && (
          <p className="text-gray-400">No rides available</p>
        )}

        <div className="grid gap-4 mb-10">
          {availableRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6"
            >
              <p>
                <b>{ride.pickup}</b> → <b>{ride.dropoff}</b>
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Status: {ride.status}
              </p>

              <button
                onClick={() => acceptRide(ride.id)}
                className="bg-[#6C63FF] px-4 py-2 rounded-xl mt-4"
              >
                Accept Ride
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-2xl mb-6">My Assigned Rides</h2>

        {assignedRides.length === 0 && (
          <p className="text-gray-400">No assigned rides</p>
        )}

        <div className="grid gap-4">
          {assignedRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6"
            >
              <p>
                <b>{ride.pickup}</b> → <b>{ride.dropoff}</b>
              </p>

              <p className="text-sm text-gray-400 mt-2 capitalize">
                Status: {ride.status}
              </p>

              {ride.status === "accepted" && (
                <button
                  onClick={() => arriveRide(ride.id)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-xl mt-4"
                >
                  Arrived
                </button>
              )}

              {ride.status === "arrived" && (
                <button
                  onClick={() => startRideAction(ride.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl mt-4"
                >
                  Start Ride
                </button>
              )}

              {ride.status === "started" && (
                <button
                  onClick={() => completeRideAction(ride.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl mt-4"
                >
                  Complete Ride
                </button>
              )}

              {ride.status === "completed" && (
                <p className="text-green-400 mt-4 font-semibold">
                  Ride Completed
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
