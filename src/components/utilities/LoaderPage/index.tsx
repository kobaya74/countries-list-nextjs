import { Loading } from '@youwe/component-library';

interface LoaderPageProps {
  loaderType: 'dots' | 'spinner';
  loaderVariant:
    | 'primary'
    | 'surface'
    | 'surfaceWhite'
    | 'secondary'
    | null
    | undefined;
}

export default function LoaderPage({
  loaderType,
  loaderVariant,
}: LoaderPageProps) {
  return (
    <div className='absolute left-1/2 top-1/2 flex h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center [&>svg]:!h-32 [&>svg]:!w-32'>
      <Loading type={loaderType} variant={loaderVariant} size='lg' />
    </div>
  );
}
