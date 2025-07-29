const generateToken = (length = 20) => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    token += alphabet[randomIndex];
  }

  return token;
};

module.exports = {
  generateToken,
};
