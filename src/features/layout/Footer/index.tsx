import { Typography } from '@youwe/component-library';

export default function Footer() {
  return (
    <footer className='mt-auto border-t py-6'>
      <Typography as='p' size='sm' className='text-center'>
        © {new Date().getFullYear()} Next.js Assignment. All rights reserved.
      </Typography>
    </footer>
  );
}
