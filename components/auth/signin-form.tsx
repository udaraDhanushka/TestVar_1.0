'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(
    !!searchParams?.get('registered')
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sign in to your account</h1>
      
      {showSuccessAlert && (
        <Alert variant="default" className="mb-4 bg-green-100 border-green-500 text-green-800">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <span className="ml-2">
            Account created successfully!
          </span>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            type="email"
            placeholder='mail@example.com'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            type="password"
            placeholder='Enter your password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/auth/reset-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Sign in'
          )}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Card>
  );
}