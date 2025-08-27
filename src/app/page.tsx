import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function Home() {
  return (
    <section className="flex px-4 py-16 md:py-32">
      <LoginForm />
    </section>
  );
}
