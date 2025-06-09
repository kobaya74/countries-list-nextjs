'use client';

import { Typography } from '@youwe/component-library';
import { useEffect } from 'react';

export default function ErrorTest1() {
  useEffect(() => {
    // Intentionally throw an error after component mounts
    throw new Error('Client-side error test');
  }, []);

  return (
    <div>
      <Typography as='h1' size='lg' className='mb-4 font-bold'>
        Client Error Test
      </Typography>
      <Typography as='p' size='md'>
        You should not see this text because an error is thrown in useEffect.
      </Typography>
    </div>
  );
}
