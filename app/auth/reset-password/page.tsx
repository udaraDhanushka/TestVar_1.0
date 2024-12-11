'use client';

import { PasswordResetForm } from '@/components/auth/password-reset-form';

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <PasswordResetForm />
      </div>
    </div>
  );
}