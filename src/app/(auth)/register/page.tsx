import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { SpecialistRegisterForm } from "@/src/features/auth/components/specialist-register-form";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  if (searchParams.role === "specialist") {
    return <SpecialistRegisterForm />;
  }
  return <RegisterForm />;
}
