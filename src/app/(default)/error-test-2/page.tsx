'use client';

import { useEffect } from 'react';
import { Typography } from '@youwe/component-library';

export default function ErrorTest2() {
  useEffect(() => {
    // Immediately throw an error on mount
    throw new Error('Immediate client-side error test');
  }, []);

  return (
    <div>
      <Typography as='h1' size='lg' className='mb-4 font-bold'>
        Immediate Error Test
      </Typography>
      <Typography as='p' size='md'>
        You should not see this text because an error is thrown during component
        initialization.
      </Typography>
    </div>
  );
}
