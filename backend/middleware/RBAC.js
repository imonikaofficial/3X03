// Role based access control middleware
const RBAC = (roles) => {
  return (req, res, next) => {
    // Check if roles exist
    if (req.roles == undefined) {
      res.status(403).json({ status: 403, message: "Unauthorized0" });
      return;
    }

    for (let role of req.roles) {
      if (roles.includes(role)) {
        console.log("Valid Role");
        next();
        return;
      } else {
        res.status(403).json({ status: 403, message: "Unauthorized1" });
        return;
      }
    }
  };
};

module.exports = RBAC;
