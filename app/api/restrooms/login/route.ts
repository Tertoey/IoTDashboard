import { NextResponse } from "next/server";

const authen = {
  username: "admin",
  password: "P@ssw0rd",
};

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    console.log(username, password);
    if (username !== authen.username || password !== authen.password) {
      return NextResponse.json({
        status: 401,
        message: "Username or Password not correct Please try again",
      });
    }
    return NextResponse.json({ status: 200, message: "Login Succesful" });
  } catch (error) {
    console.log(`Error at /api/hotel POST: ${error}`);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
