import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up — Janak Positioning",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <SignupForm />
    </main>
  );
}
