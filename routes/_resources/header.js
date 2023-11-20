require("dotenv").config();

// Create reusable headers with the private key inserted
const header = {
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.PERSONAL_API_KEY,
  },
};

module.exports = header;
