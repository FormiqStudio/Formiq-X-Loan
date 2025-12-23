import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["admin", "dsa", "user"], default: "user" },
    bankName: { type: String, enum: ["SBI", "HDFC", "ICICI", "AXIS", "KOTAK"] },
    dsaId: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    profilePicture: { type: String },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.generateDSAId = function () {
  const bankCode = this.bankName?.substring(0, 3).toUpperCase() || "DSA";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${bankCode}${timestamp}${random}`;
};

UserSchema.pre("save", function (next) {
  if (this.role === "dsa" && !this.dsaId) {
    this.dsaId = this.generateDSAId();
  }
  next();
});

const User = mongoose.model("User", UserSchema);

async function seedUsers() {
  try {
    console.log("🌱 Starting database seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    const existingAdmin = await User.findOne({
      email: "admin@loanmanagement.com",
    });
    if (existingAdmin) {
      console.log("👤 Admin user already exists");
    } else {
      const adminUser = new User({
        email: "admin@loanmanagement.com",
        password: "Admin@123",
        firstName: "System",
        lastName: "Administrator",
        phone: "9999999999",
        role: "admin",
        isActive: true,
        isVerified: true,
        verifiedAt: new Date(),
      });

      await adminUser.save();
      console.log("👑 Admin user created successfully");
      console.log("   Email: admin@loanmanagement.com");
      console.log("   Password: Admin@123");
    }

    const existingDSA = await User.findOne({ email: "dsa@sbi.com" });
    if (existingDSA) {
      console.log("🏦 DSA user already exists");
    } else {
      const dsaUser = new User({
        email: "dsa@sbi.com",
        password: "DSA@123",
        firstName: "John",
        lastName: "Smith",
        phone: "9888888888",
        role: "dsa",
        bankName: "SBI",
        isActive: true,
        isVerified: true,
        verifiedAt: new Date(),
      });

      await dsaUser.save();
      console.log("🏦 DSA user created successfully");
      console.log("   Email: dsa@sbi.com");
      console.log("   Password: DSA@123");
      console.log("   Bank: SBI");
      console.log("   DSA ID:", dsaUser.dsaId);
    }

    const existingUser = await User.findOne({ email: "user@example.com" });
    if (existingUser) {
      console.log("👤 Regular user already exists");
    } else {
      const regularUser = new User({
        email: "user@example.com",
        password: "User@123",
        firstName: "Jane",
        lastName: "Doe",
        phone: "9777777777",
        role: "user",
        isActive: true,
        isVerified: true,
        verifiedAt: new Date(),
      });

      await regularUser.save();
      console.log("👤 Regular user created successfully");
      console.log("   Email: user@example.com");
      console.log("   Password: User@123");
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("1. Admin: admin@loanmanagement.com / Admin@123");
    console.log("2. DSA: dsa@sbi.com / DSA@123");
    console.log("3. User: user@example.com / User@123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}
seedUsers();
