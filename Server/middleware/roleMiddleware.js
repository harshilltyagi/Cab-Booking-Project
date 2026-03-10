const requireRole = (role) => {
  return (req, res, next) => {
    // auth middleware must run before this
    if (!req.profile) {
      return res.status(403).json({ error: "Profile not loaded" });
    }

    if (req.profile.role !== role) {
      return res.status(403).json({ error: `Access denied: ${role} only` });
    }

    next();
  };
};

export default requireRole;
