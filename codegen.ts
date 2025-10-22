import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  generates: {
    './src/modules/': {
      schema: ['./src/typeDefs.ts', './src/modules/**/typeDefs.ts'],
      preset: 'graphql-modules',
      presetConfig: {
        baseTypesPath: '../generated-types/graphql.ts',
        filename: 'generated-types/module-types.ts',
        useGraphQLModules: false,
      },
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../context#Context',
      },
    },
  },
  overwrite: true,
  require: ['ts-node/register'],
  ignoreNoDocuments: true,
};

export default config;
