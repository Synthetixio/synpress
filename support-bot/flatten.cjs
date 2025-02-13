const fs = require('fs')
const path = require('path')

const INPUT_DIR = './'
const OUTPUT_DIR = './output'
const MAX_LINES = 500000

let outputFileNum = 1
let outputLines = 0
let outputFile = null

// Read and parse .gitignore patterns
let ignorePatterns = []
try {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8')
  ignorePatterns = gitignoreContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((pattern) => {
      // Convert glob patterns to regex-compatible strings
      return pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\?/g, '.')
    })
} catch (error) {
  console.log('No .gitignore file found')
}

function shouldIgnore(relativePath) {
  // Always ignore node_modules and .git
  if (relativePath.includes('node_modules') || relativePath.includes('.git')) {
    return true
  }

  return ignorePatterns.some((pattern) => {
    const regex = new RegExp(`^${pattern}$|^${pattern}/|/${pattern}$|/${pattern}/`)
    return regex.test(relativePath)
  })
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  outputFile.write(`// File: ${filePath}\n`)
  outputLines++

  lines.forEach((line) => {
    if (outputLines >= MAX_LINES) {
      outputFile.close()
      outputFile = fs.createWriteStream(path.join(OUTPUT_DIR, `output${outputFileNum++}.txt`))
      outputLines = 0
    }

    outputFile.write(`${line}\n`)
    outputLines++
  })
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath)

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item)
    const relativePath = path.relative(INPUT_DIR, itemPath)
    const stat = fs.statSync(itemPath)

    // Skip if the path should be ignored
    if (shouldIgnore(relativePath)) {
      return
    }

    if (stat.isDirectory()) {
      processDirectory(itemPath)
    } else if (['.js', '.ts', '.json', '.md'].includes(path.extname(itemPath))) {
      processFile(itemPath)
    }
  })
}

function calculateStats() {
  let totalLines = 0
  let totalChars = 0

  // Read all output files
  const files = fs.readdirSync(OUTPUT_DIR)
  files.forEach((file) => {
    if (file.startsWith('output') && file.endsWith('.txt')) {
      const content = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf-8')
      const lines = content.split('\n')
      totalLines += lines.length
      totalChars += content.length
    }
  })

  console.log('\nStatistics:')
  console.log(`Total number of lines: ${totalLines.toLocaleString()}`)
  console.log(`Total number of characters: ${totalChars.toLocaleString()}`)
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })
outputFile = fs.createWriteStream(path.join(OUTPUT_DIR, `output${outputFileNum++}.txt`))
processDirectory(INPUT_DIR)
if (outputFile) outputFile.close()

// Calculate and display statistics
calculateStats()
