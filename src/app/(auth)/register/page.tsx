import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { SpecialistRegisterForm } from "@/src/features/auth/components/specialist-register-form";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; referralCode?: string }>;
}) {
  const { role, referralCode } = await searchParams;

  if (role === "specialist") {
    const session = await auth();
    if (session?.accessToken) {
      redirect(
        session.user?.role?.toUpperCase() === "PROVIDER"
          ? "/provider/profile"
          : referralCode
            ? `/become-provider?referralCode=${encodeURIComponent(referralCode)}`
            : "/become-provider",
      );
    }
    return <SpecialistRegisterForm referralCode={referralCode} />;
  }

  return <RegisterForm />;
}