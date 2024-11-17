import { RegistrySignupForm } from "@/components/Registry/RegistrySignupForm";

export default async function RegistrySignupPage() {
  return (
    <section className="flex flex-col items-center justify-center h-full py-12">
      <div className="flex flex-col items-center justify-center w-full gap-12 md:flex-row">
        <div className="flex flex-col w-full max-w-xl gap-4 mb-4 md:self-start">
          <h1 className="text-3xl">Registration Form</h1>
          <RegistrySignupForm />
        </div>
      </div>
    </section>
  );
}
