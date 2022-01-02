/* eslint-disable @typescript-eslint/no-var-requires */
const replace = require('replace-in-file')
const options = {
  files: 'src/**/*.ts',
  from: [
    /import Configuration from/g,
    /Configuration.VITE_/g
  ],
  to: [
    '//import Configuration from',
    'import.meta.env.VITE_'
  ]
}

console.log('Start : Replacing "Configuration." by "import.meta.env."')

const results = replace.sync(options)

for (const result of results.filter(r => r.hasChanged)) {
  console.log(result.file)
}

console.log('End : Replacing "Configuration." by "import.meta.env."')