const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export default isAdmin;
