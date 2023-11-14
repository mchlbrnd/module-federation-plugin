import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing.js'
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './generator.js';
import { NativeFederationGeneratorSchema } from './schema.js';

describe('native-federation generator', () => {
  let appTree: Tree;
  const options: NativeFederationGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
