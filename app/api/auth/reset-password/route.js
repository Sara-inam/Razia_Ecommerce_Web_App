import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    // 1. find user
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 2. debug logs (before validation)
    console.log("Entered OTP:", otp);
    console.log("DB OTP:", user.resetOtp);
    console.log("Expiry:", user.resetOtpExpire);
    console.log("Now:", Date.now());

    // 3. safe expiry check
    const isExpired =
      !user.resetOtpExpire ||
      new Date(user.resetOtpExpire).getTime() < Date.now();

    // 4. safe OTP check
    const isOtpInvalid =
      !user.resetOtp ||
      user.resetOtp.toString().trim() !== otp.toString().trim();

    // 5. validation fail
    if (isOtpInvalid || isExpired) {
      return Response.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 6. hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7. update user
    user.password = hashedPassword;

    // clear OTP
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    // 8. success response
    return Response.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);

    return Response.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}