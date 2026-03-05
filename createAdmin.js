import 'dotenv/config'; // ✅ loads .env automatically
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; 
import { connectDB } from "./lib/db.js";
import logger from "./config/logger.js"; 

const run = async () => {
  try {
    await connectDB();
    logger.info("Connected to database");

    const name = "Admin Name";
    const email = "admin@gmail.com";
    const password = "admin@123";
    const role = "admin";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Admin user already exists with email: ${email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    logger.info(`Admin user created successfully! Email: ${email}`);
    process.exit(0);
  } catch (err) {
    logger.error(`Error creating admin: ${err.message}`);
    process.exit(1);
  }
};

run();