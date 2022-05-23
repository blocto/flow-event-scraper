import * as fs from 'fs'

const PATH_OUTPUT_FILE = 'events.json'

export const record: (context: string) => void = (context) => {
  console.log(`💥 ${context}`)
  fs.appendFileSync(PATH_OUTPUT_FILE, context)
  fs.appendFileSync(PATH_OUTPUT_FILE, '\n')
}