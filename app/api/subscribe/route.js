// import { NextResponse } from "next/server";

// let subscribers = []; // (demo ke liye, DB use karna better hai)

// export async function POST(req) {
//   const { email } = await req.json();

//   if (!email) {
//     return NextResponse.json({ message: "Email required" }, { status: 400 });
//   }

//   const exists = subscribers.find((e) => e === email);

//   if (exists) {
//     return NextResponse.json({ message: "Already subscribed" }, { status: 409 });
//   }

//   subscribers.push(email);

//   return NextResponse.json({
//     message: "Subscribed successfully",
//     total: subscribers.length,
//   });
// }