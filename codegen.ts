import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  generates: {
    './src/modules/': {
      schema: ['./src/graphql/typeDefs.ts', './src/modules/**/typeDefs.ts'],
      preset: 'graphql-modules',
      presetConfig: {
        baseTypesPath: '../generated-types/graphql.ts',
        filename: 'generated-types/module-types.ts',
        useGraphQLModules: false,
      },
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../graphql/types#Context',
      },
    },
  },
  overwrite: true,
  require: ['ts-node/register'],
  ignoreNoDocuments: true,
};

export default config;
