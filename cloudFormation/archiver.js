/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const output = fs.createWriteStream(
  path.join('.', '.output/my-lambda-function.zip')
)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => {
  console.log(archive.pointer() + ' total bytes')
  console.log(
    'archiver has been finalized and the output file descriptor has closed.'
  )
})

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn(err)
  } else {
    throw err
  }
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

archive.directory('.output/server', false)

archive.finalize()
