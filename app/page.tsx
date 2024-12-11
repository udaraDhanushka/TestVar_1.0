import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div
      className="h-screen flex flex-col justify-between bg-gradient-to-b from-gray-50 to-white"
      style={{
        backgroundImage: 'url("/images/premium_photo.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-grow flex items-start justify-center pt-20 mt-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Master Your Knowledge
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create, study, and master flashcards efficiently. Track your progress
            and improve your learning journey.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/auth/signin">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="px-8">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <footer className="text-center py-4 text-gray-900">
        &copy; 2024 Testvar | All rights reserved.
      </footer>

    </div>
  );
}