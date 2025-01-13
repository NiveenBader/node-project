function errorMessage(message) {
  throw new Error(message);
}

module.exports = {
  jwtkey: process.env.JWT_KEY ?? errorMessage("JWT_KEY is mising"),
};
