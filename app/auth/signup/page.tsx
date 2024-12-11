'use client';

import { SignupForm } from '@/components/auth/signup-form';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{
        backgroundImage: 'url("/images/signUP.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-md w-full mx-4">
        <SignupForm />
      </div>
    </div>
  );
}