import User from "@/models/User";
import { transporter } from "@/lib/mailer"; // 👈 your file path

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 1. find user
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 2. generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 3. save OTP
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 4. send email using shared transporter
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset OTP",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your OTP code is:</p>

          <h1 style="
            background:#111;
            color:#fff;
            padding:10px;
            width:120px;
            text-align:center;
            border-radius:8px;
          ">
            ${otp}
          </h1>

          <p>This OTP will expire in <b>10 minutes</b>.</p>
        </div>
      `,
    });

   return Response.json({
  message: "OTP sent successfully",
  expiresIn: user.resetOtpExpire,
});

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);

    return Response.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}