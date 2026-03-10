import supabase from "../supabase.js";

export const createReview = async (req, res) => {
  try {
    const riderId = req.user.id;
    const { ride_id, rating, comment } = req.body;

    if (!ride_id || !rating) {
      return res.status(400).json({ error: "ride_id and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", ride_id)
      .eq("rider_id", riderId)
      .single();

    if (rideError || !ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "completed") {
      return res
        .status(400)
        .json({ error: "Only completed rides can be reviewed" });
    }

    if (ride.payment_status !== "paid") {
      return res.status(400).json({ error: "Only paid rides can be reviewed" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          ride_id,
          rider_id: riderId,
          driver_id: ride.driver_id,
          rating,
          comment: comment || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: "Review submitted successfully",
      review: data,
    });
  } catch (err) {
    console.log("Create review error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getReviewByRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("ride_id", rideId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ review: data });
  } catch (err) {
    console.log("Get review error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
