// eslint-disable-next-line @typescript-eslint/no-var-requires
const fileSystem = require('fs')

console.log('Start : Deleting files that should not be deployed"')

const elementsToDelete = ['dist/data']

for (const elementToDelete of elementsToDelete) {
  fileSystem.rmSync(elementToDelete, { recursive: true, force: true })
  console.log(`${elementToDelete} deleted`)
}

console.log('End : Deleting files that should not be deployed')