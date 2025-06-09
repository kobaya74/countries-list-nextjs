'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Typography } from '@youwe/component-library';
import LoaderPage from '@/components/utilities/LoaderPage';
import { Suspense } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Suspense
      fallback={<LoaderPage loaderType='spinner' loaderVariant='secondary' />}
    >
      <div className='flex flex-col items-center justify-center px-4 text-center'>
        <Typography as='h1' size='lg' className='mb-4 font-bold'>
          Something went wrong
        </Typography>
        <Typography as='p' size='md' className='mb-8 max-w-md'>
          We are sorry, but there was an error processing your request. Our team
          has been notified and is working to fix the issue.
        </Typography>
        <div className='flex flex-col gap-4 mobile:flex-row'>
          <Button
            onClick={reset}
            size='md'
            variant='neutral'
            className='rounded-md px-6 py-3'
          >
            Try again
          </Button>
          <Link href='/' className='rounded-md border px-6 py-3'>
            Return to Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className='text-black mt-8 max-w-2xl overflow-auto rounded-md p-4 text-left'>
            <Typography as='p' size='sm' className='font-semibold mb-2'>
              Error details (only visible in development):
            </Typography>
            <Typography as='p' size='sm' className='font-mono'>
              {error.message}
            </Typography>
            {error.stack && (
              <pre className='rounded mt-2 overflow-auto p-2 text-xs'>
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
}
