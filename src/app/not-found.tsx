import { Typography } from '@youwe/component-library';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
      <Typography as='h1' size='lg' className='mb-4 font-bold'>
        404
      </Typography>
      <Typography as='h2' size='md' className='mb-6'>
        Page Not Found
      </Typography>
      <Typography as='p' size='md' className='mb-8 max-w-md'>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Link href='/' className='rounded-md border px-6 py-3'>
        Return to Home
      </Link>
    </div>
  );
}
