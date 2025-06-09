import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'https://countries.trevorblades.com/graphql',
    'src/graphql/schema.graphql',
  ],
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    './src/graphql/generated-types/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        addMutationDefaults: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
