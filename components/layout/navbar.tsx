'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, Layout, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background">
      <div className="max-w-screen-xxl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold">Testvar</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground"
              >
                <Layout className="h-4 w-4 mr-2 ml-5" />
                Dashboard
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Collections
              </Link>
              {true && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-foreground hover:text-muted-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}