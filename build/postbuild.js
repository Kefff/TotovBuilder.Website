// eslint-disable-next-line @typescript-eslint/no-var-requires
const replace = require('replace-in-file')
const options = {
  files: 'src/**/*.ts',
  from: [
    /\/\/import Configuration from/g,
    /import.meta.env.VITE_/g
  ],
  to: [
    'import Configuration from',
    'Configuration.VITE_'
  ]
}

console.log('Start : Reverting "Configuration." by "import.meta.env."')

const results = replace.sync(options)

for (const result of results.filter(r => r.hasChanged)) {
  console.log(result.file)
}

console.log('End : Reverting "Configuration." by "import.meta.env."')