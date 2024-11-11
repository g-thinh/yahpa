import { RegistrySignupForm } from "@/components/Registry/RegistrySignupForm";

export default function RegistrySignup() {
  return (
    <section className="flex flex-col justify-center items-center h-full py-12">
      <div className="flex flex-col justify-center items-center w-full gap-12 md:flex-row">
        <div className="flex flex-col w-full max-w-xl gap-4 mb-4 md:self-start">
          <h1 className="text-3xl">Register</h1>
          <RegistrySignupForm />
        </div>
      </div>
    </section>
  );
}
