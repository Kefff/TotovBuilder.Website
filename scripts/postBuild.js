import { rmSync } from 'fs'

console.log('Start : Deleting files that should not be deployed')

const elementsToDelete = [
  'dist/data' // This folder contains data used by the application when launching 'npm run dev'
]

for (const elementToDelete of elementsToDelete) {
  rmSync(elementToDelete, { recursive: true, force: true })
  console.log(`${elementToDelete} deleted`)
}

console.log('End : Deleting files that should not be deployed')