import RegistrationForm from "@/components/registration-form";

export default function FormTab() {
  return (
    <section className="flex flex-col items-center justify-center w-full min-h-[60vh] gap-8 pt-8">
      <h2 className="text-3xl font-bold text-cyan-200 mb-4 neon-text">Formularz zgłoszeniowy</h2>
      <RegistrationForm />
    </section>
  );
}
