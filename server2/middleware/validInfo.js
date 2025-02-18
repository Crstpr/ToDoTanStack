module.exports = (req, res, next) => {
    const { username, password } = req.body;
  
  
    if (req.path === "/register") {
      if (![username, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (username.length < 3) {
        return res.status(401).json("Username must be at least 6 characters long");
      } else if (password.length < 6) {
        return res.status(401).json("Password must be at least 6 characters long");
      }

 

    } else if (req.path === "/login") {
      if (![username, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (username.length < 3) {
        return res.status(401).json("Username must be at least 6 characters long");
      } else if (password.length < 6) {
        return res.status(401).json("Password must be at least 6 characters long");
      }

    }
  
    next();
  };