import RegisterForm from "@/components/register/RegisterForm";
import Link from "next/link";

export default function Register() {
  return (
    <div className="p-8 md:p-14 bg-gradient-to-b from-purple-100 to-purple-300 h-screen w-full flex items-center justify-center">
      <div className="bg-white shadow-lg p-10 rounded-lg border border-gray-100 min-w-1/3 gap-8 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">
          Welcome To <span className="text-purple-400"> Workflo!</span>
        </h1>
        <div className="w-full">
          <RegisterForm />
        </div>
        <div>
          Already have an account?{" "}
          <Link href={"/login"}>
            <span className="text-purple-700"> Login.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
