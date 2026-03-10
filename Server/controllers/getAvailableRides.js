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
