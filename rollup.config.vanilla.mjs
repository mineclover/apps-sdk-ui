import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import cssString from './rollup-plugin-css-string.mjs';

const srcDir = './src/vanilla';
const componentsDir = join(srcDir, 'components');

// Get all component directories
const getComponents = () => {
  if (!existsSync(componentsDir)) return [];
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

const components = getComponents();

const configs = [
  // Main bundle (all components)
  {
    input: 'src/vanilla/index.ts',
    output: [
      {
        file: 'dist/vanilla/apps-sdk-ui.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/vanilla/apps-sdk-ui.js',
        format: 'iife',
        name: 'AppsSDKUI',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      cssString(), // Must come before nodeResolve
      nodeResolve({
        preferBuiltins: false,
        extensions: ['.ts', '.js', '.css']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/vanilla',
        outDir: 'dist/vanilla',
        rootDir: 'src',
        exclude: ['**/*.test.ts', '**/*.spec.ts', 'src/components/**/*']
      })
    ],
    external: [],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false
    }
  }
];

// Add individual component bundles
components.forEach(component => {
  configs.push(
    // ESM bundle
    {
      input: `src/vanilla/components/${component}/index.ts`,
      output: {
        file: `dist/vanilla/components/${component}/index.esm.js`,
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      },
      plugins: [
        cssString(),
        nodeResolve({
          preferBuiltins: false,
          extensions: ['.ts', '.js', '.css']
        }),
        commonjs(),
        typescript({
          tsconfig: './tsconfig.json',
          declaration: true,
          declarationDir: `dist/vanilla/components/${component}`,
          outDir: `dist/vanilla/components/${component}`,
          rootDir: 'src',
          exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
      ],
      external: [],
      treeshake: {
        moduleSideEffects: false
      }
    },
    // IIFE bundle
    {
      input: `src/vanilla/components/${component}/index.ts`,
      output: {
        file: `dist/vanilla/components/${component}/index.js`,
        format: 'iife',
        name: `AppsSDKUI.${component.charAt(0).toUpperCase() + component.slice(1)}`,
        sourcemap: true,
        exports: 'named'
      },
      plugins: [
        cssString(),
        nodeResolve({
          preferBuiltins: false,
          extensions: ['.ts', '.js', '.css']
        }),
        commonjs(),
        typescript({
          tsconfig: './tsconfig.json',
          declaration: false,
          outDir: `dist/vanilla/components/${component}`,
          rootDir: 'src',
          exclude: ['**/*.test.ts', '**/*.spec.ts']
        })
      ],
      external: [],
      treeshake: {
        moduleSideEffects: false
      }
    }
  );
});

export default configs;
