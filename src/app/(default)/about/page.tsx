import type { Metadata } from 'next';
import LoaderPage from '@/components/utilities/LoaderPage';
import { Suspense } from 'react';
import { Typography } from '@youwe/component-library';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the Next.js Assignment project',
};

export default function About() {
  return (
    <Suspense
      fallback={<LoaderPage loaderType='spinner' loaderVariant='secondary' />}
    >
      <div className='mx-auto max-w-4xl'>
        <Typography as='h1' size='lg' className='mb-6 font-bold'>
          About This Project
        </Typography>
        <Typography as='p' size='md' className='mb-4'>
          This is a Next.js project built as part of an assignment to
          demonstrate understanding of Next.js concepts including:
        </Typography>
        <ul className='mb-6 list-disc pl-6'>
          <li>App Router architecture</li>
          <li>Route groups</li>
          <li>Layouts and nested layouts</li>
          <li>Error handling</li>
          <li>Metadata API</li>
          <li>Client and server components</li>
        </ul>
        <p>
          The project follows best practices for Next.js application structure
          and error handling.
        </p>
      </div>
    </Suspense>
  );
}
