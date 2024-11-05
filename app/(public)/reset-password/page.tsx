import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import Link from "next/link";

const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-700"
            >
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <Button className="w-full">Reset Password</Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
