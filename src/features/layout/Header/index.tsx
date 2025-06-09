import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className='border-gray-200 mb-8 border-b py-4'>
      <div className='container mx-auto px-4'>
        <nav className='flex flex-wrap justify-between gap-4'>
          <div className='flex flex-col items-center justify-center'>
            <Link href='/' className='hover:underline'>
              <Image
                className='dark:invert'
                src='/next.svg'
                alt='Next.js logo'
                width={180}
                height={38}
                priority
              />
            </Link>
          </div>
          <div className='flex gap-4'>
            <Link href='/' className='flex items-center hover:underline'>
              Home
            </Link>
            <Link href='/about' className='flex items-center hover:underline'>
              About
            </Link>
            <Link href='/error' className='flex items-center hover:underline'>
              Error Page
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
