import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { SpecialistRegisterForm } from "@/src/features/auth/components/specialist-register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;

  if (role === "specialist") {
    return <SpecialistRegisterForm />;
  }

  return <RegisterForm />;
}