import Link from 'next/link';
import { Metadata } from 'next';
import LoaderPage from '@/components/utilities/LoaderPage';
import { Suspense } from 'react';
import { Typography } from '@youwe/component-library';

export const metadata: Metadata = {
  title: 'Error Page Example',
  description: 'An example of a custom error page in Next.js',
};

export default function ErrorPage() {
  return (
    <Suspense
      fallback={<LoaderPage loaderType='spinner' loaderVariant='secondary' />}
    >
      <div className='flex flex-col items-center justify-center px-4 text-center'>
        <Typography as='h1' size='lg' className='mb-4 font-bold'>
          Example Error Page
        </Typography>
        <Typography as='p' size='md' className='mb-8 max-w-md'>
          This is an example of a custom error page. The actual error handling
          is done by the error.tsx file.
        </Typography>
        <div className='flex flex-col gap-4 mobile:flex-row'>
          <Link href='/error-test-1' className='rounded-md border px-6 py-3'>
            Try Error Test 1
          </Link>
          <Link href='/error-test-2' className='rounded-md border px-6 py-3'>
            Try Error Test 2
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
