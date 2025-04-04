const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
  
    return { accessToken, refreshToken };
  };
  