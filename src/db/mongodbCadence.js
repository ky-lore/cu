// This module aims at connecting to the mongodb database utilize the connectDB to initialize a connection.
// It then sets up a schema

const express = require("express");
const router = express.Router();

// Mongoose setip
const mongoose = require("mongoose");
// const mongoDBURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/mydemoDB";

// connecting to database
const connectDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGODB_URL, {
  dbName: "my_database"   // <-- must match the database name in Atlas
});
    console.log("✅ MongoDB connection successful");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  }
};

connectDB();
//connecting databse

const TaskSchema = new mongoose.Schema({
  "Account": String,
  "Internal Slack Channel ID": String,
  "Day of Week": String,
  "Growth Rep": String,
  "Cadence": String,
  "used": Boolean,
  "Growth Rep UID": String,
  "Pod": String
  
  
});
const Task = mongoose.model("Task", TaskSchema, "Weekly_Cadence_Four");


module.exports = { Task };