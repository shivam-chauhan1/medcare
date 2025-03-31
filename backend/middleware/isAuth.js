import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const isAuth = (req, res, next) => {
  try {
    // get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token found. Unauthorized." });
    }

    // verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    // attach user info to request object
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token. Unauthorized." });
  }
};

export default isAuth;
