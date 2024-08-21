const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("TOKEN", token);

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("USER", result);
    req.user = result;

    next();
  });
};

module.exports = validateToken;
