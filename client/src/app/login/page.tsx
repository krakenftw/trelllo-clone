import LoginForm from "@/components/login/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div className="p-8 md:p-14 bg-gradient-to-b from-purple-100 to-purple-300 h-screen w-full flex items-center justify-center">
      <div className="bg-white shadow-lg p-10 rounded-lg border border-gray-100 min-w-1/3 gap-8 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">
          Welcome To <span className="text-purple-400"> Workflo!</span>
        </h1>
        <div className="w-full">
          <LoginForm />
        </div>
        <div>
          Don&apos;t have an account? Create a
          <Link href={"/register"}>
            <span className="text-purple-700"> new account.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
