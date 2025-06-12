import Link from 'next/link';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
          <span className="hidden font-bold sm:inline-block font-headline text-lg">
            N8N Firebase Interface
          </span>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
