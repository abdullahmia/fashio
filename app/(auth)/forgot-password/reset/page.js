import { GenerateBreadcrumb } from "@/components/generate-breadcrumb";
import { Suspense } from "react";
import ResetPasswordForm from "./components/reset-password-form";

export const metadata = {
  title: "Reset Password",
  description: "Reset Password to your account",
};

export default function ResetPassword() {
  return (
    <div>
      <GenerateBreadcrumb title="Reset Password" />

      <div className="container w-full h-full flex flex-col items-center justify-center space-y-5 lg:py-32 py-14">
        {/* Reset password form */}
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
