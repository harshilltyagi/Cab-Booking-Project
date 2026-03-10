import supabase from "../supabase.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = data.user;

    const { data: profileData, error: profileError } = await supabase
      .from("Profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return res.status(403).json({ error: "Profile not found" });
    }

    req.profile = profileData;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

export default auth;
