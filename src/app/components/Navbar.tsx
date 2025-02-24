import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Logo />
            <span className="text-xl font-bold">小飞虎</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 