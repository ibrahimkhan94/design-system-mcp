// Turns tokens/tokens.json (W3C DTCG format) into:
//   build/tokens.css        CSS custom properties (--ds-*) for components and the demo site
//   build/tokens.flat.json  a flat list the MCP server and checker read
import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['tokens/tokens.json'],
  usesDtcg: true,
  log: { verbosity: 'silent' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds',
      buildPath: 'build/',
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{ destination: 'tokens.flat.json', format: 'flat-tokens' }],
    },
  },
});

sd.registerFormat({
  name: 'flat-tokens',
  format: ({ dictionary }) =>
    JSON.stringify(
      dictionary.allTokens.map((t) => ({
        name: t.path.join('.'),
        cssVar: `--ds-${t.path.join('-')}`,
        type: t.$type,
        value: t.$value,
        description: t.$description ?? null,
      })),
      null,
      2,
    ),
});

await sd.buildAllPlatforms();
console.log('Tokens built: build/tokens.css, build/tokens.flat.json');
