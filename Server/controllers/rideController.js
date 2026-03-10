import razorpay from "../razorpay.js";
import supabase from "../supabase.js";

export const createRide = async (req, res) => {
  try {
    const riderId = req.user.id;
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
      return res.status(400).json({ error: "Pickup and dropoff required" });
    }

    const baseFare = 50;
    const distance = 10;
    const perKm = 12;

    const fare = baseFare + distance * perKm;

    const { data, error } = await supabase
      .from("rides")
      .insert([
        {
          rider_id: riderId,
          pickup,
          dropoff,
          status: "requested",
          fare,
          payment_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: "Ride created",
      ride: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAvailableRides = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "requested")
      .is("driver_id", null)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ rides: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const driverId = req.user.id;
    const rideId = req.params.id;

    const { data, error } = await supabase
      .from("rides")
      .update({
        driver_id: driverId,
        status: "accepted",
      })
      .eq("id", rideId)
      .is("driver_id", null)
      .eq("status", "requested")
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    if (!data) {
      return res.status(409).json({
        error: "Ride already accepted by another driver",
      });
    }

    // io.to(`rider_${data.rider_id}`).emit("ride_updated", data);
    // io.to(`driver_${data.driver_id}`).emit("ride_updated", data);

    res.json({
      message: "Ride accepted",
      ride: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyRides = async (req, res) => {
  try {
    const riderId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("rider_id", riderId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ rides: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAssignedRides = async (req, res) => {
  try {
    const driverId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ rides: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const arriveRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const driverId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({
        status: "arrived",
      })
      .eq("id", rideId)
      .eq("driver_id", driverId)
      .eq("status", "accepted")
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res
        .status(400)
        .json({ error: "Only accepted rides can be marked arrived" });
    }

    // io.to(`rider_${data.rider_id}`).emit("ride_updated", data);
    // io.to(`driver_${data.driver_id}`).emit("ride_updated", data);

    res.json({
      message: "Driver arrived",
      ride: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const startRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const driverId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({
        status: "started",
      })
      .eq("id", rideId)
      .eq("driver_id", driverId)
      .eq("status", "arrived")
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res
        .status(400)
        .json({ error: "Only arrived rides can be started" });
    }

    // io.to(`rider_${data.rider_id}`).emit("ride_updated", data);
    // io.to(`driver_${data.driver_id}`).emit("ride_updated", data);

    res.json({
      message: "Ride started",
      ride: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const completeRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    const driverId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({
        status: "completed",
      })
      .eq("id", rideId)
      .eq("driver_id", driverId)
      .eq("status", "started")
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res
        .status(400)
        .json({ error: "Only started rides can be completed" });
    }

    // io.to(`rider_${data.rider_id}`).emit("ride_updated", data);
    // io.to(`driver_${data.driver_id}`).emit("ride_updated", data);

    res.json({
      message: "Ride completed",
      ride: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const rideId = req.params.id;
    const riderId = req.user.id;

    const { data: ride, error } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .eq("rider_id", riderId)
      .single();

    if (error || !ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "completed") {
      return res
        .status(400)
        .json({ error: "Only completed rides can be paid" });
    }

    if (ride.payment_status === "paid") {
      return res.status(400).json({ error: "Ride already paid" });
    }

    const options = {
      amount: ride.fare * 100,
      currency: "INR",
      receipt: ride.id,
      notes: {
        rideId: ride.id,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      rideId: ride.id,
      riderEmail: req.user.email || "",
    });
  } catch (err) {
    console.log("Razorpay order error:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

export const markRidePaid = async (req, res) => {
  try {
    const rideId = req.params.id;
    const riderId = req.user.id;

    const { data, error } = await supabase
      .from("rides")
      .update({ payment_status: "paid" })
      .eq("id", rideId)
      .eq("rider_id", riderId)
      .eq("status", "completed")
      .eq("payment_status", "pending")
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(400).json({ error: "Ride cannot be marked paid" });
    }

    res.json({ message: "Payment successful", ride: data });
  } catch (err) {
    console.log("Mark paid error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
