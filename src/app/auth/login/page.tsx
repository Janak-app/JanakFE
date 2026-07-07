import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In — Janak Positioning",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col px-6 py-10">
      <LoginForm />
    </main>
  );
}
