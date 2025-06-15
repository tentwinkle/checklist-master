import { Building } from 'lucide-react';
import Link from 'next/link';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
      <Building className={`text-primary ${size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-7 w-7' : 'h-8 w-8'}`} />
      <span className={`font-headline font-semibold ${sizeClasses[size]}`}>
        CheckFlow
      </span>
    </Link>
  );
}
