import { Loading } from '@youwe/component-library';

interface LoaderComponentProps {
  loaderType: 'dots' | 'spinner';
  loaderVariant:
    | 'primary'
    | 'surface'
    | 'surfaceWhite'
    | 'secondary'
    | null
    | undefined;
  loaderSize: 'sm' | 'md' | 'lg' | null | undefined;
  loaderText?: string;
}

export default function LoaderComponent({
  loaderType,
  loaderVariant,
  loaderSize,
  loaderText,
}: LoaderComponentProps) {
  return (
    <div className='flex items-center gap-2'>
      <Loading type={loaderType} variant={loaderVariant} size={loaderSize} />
      <span>{loaderText}</span>
    </div>
  );
}
