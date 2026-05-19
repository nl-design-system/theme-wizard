/**
 * Config to use with https://custom-elements-manifest.open-wc.org/analyzer/
 */

import { getTsProgram, typeParserPlugin } from '@wc-toolkit/type-parser';
import fs from 'node:fs';
import { replace } from './utils.mjs';

const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const { name, author, description, homepage, license, version } = packageData;

export default {
  globs: [`src/**/clippy-*/index.ts`],
  // Give the plugin access to the TypeScript type checker
  overrideModuleCreation({ globs, ts }) {
    const program = getTsProgram(ts, globs, 'tsconfig.json');
    return program.getSourceFiles().filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
  plugins: [
    // Parse your components API's TypeScript types to a CEM usable format
    // https://wc-toolkit.com/documentation/type-parser/
    typeParserPlugin(),

    // Append package data
    {
      name: 'clippy-package-data',
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.package = { name, author, description, homepage, license, version };
      },
    },

    // Exclude internal members (private/protected) from the CEM output
    {
      name: 'clippy-exclude-internal-members',
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.modules = customElementsManifest.modules.map((module) => {
          const declarations = (module.declarations || []).map((declaration) => {
            const members = (declaration.members || []).reduce((acc, member) => {
              if (['private', 'protected'].includes(member.privacy)) {
                return acc;
              }

              if (['styles', 'tagName'].includes(member.name)) {
                return acc;
              }

              return [...acc, member];
            }, []);
            return {
              ...declaration,
              members,
            };
          });
          return {
            ...module,
            declarations,
          };
        });
      },
    },

    // Translate module paths to dist/ instead of src/
    // {
    //   name: 'clippy-translate-module-paths',
    //   packageLinkPhase({ customElementsManifest }) {
    //     customElementsManifest?.modules?.forEach((mod) => {
    //       const terms = [{ from: /^src\//, to: 'dist/' }];

    //       mod.path = replace(mod.path, terms);

    //       for (const ex of mod.exports ?? []) {
    //         ex.declaration.module = replace(ex.declaration.module, terms);
    //       }

    //       for (const dec of mod.declarations ?? []) {
    //         if (dec.kind === 'class') {
    //           for (const member of dec.members ?? []) {
    //             if (member.inheritedFrom) {
    //               member.inheritedFrom.module = replace(member.inheritedFrom.module, terms);
    //             }
    //           }
    //         }
    //       }
    //     });
    //   },
    // },
  ],
};
