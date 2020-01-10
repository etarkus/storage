const { Storage } = require('@google-cloud/storage')

const storage = new Storage()
const bucket = storage.bucket('s.tarkus.me')

exports.storage = async function storage(req, res) {
  const origin =
    req.get('Origin') === 'http://localhost:3000'
      ? 'http://localhost:3000'
      : 'https://storage.tarkus.me'
  res.set('Access-Control-Allow-Origin', origin)
  res.set('Access-Control-Allow-Credentials', 'true')
  res.removeHeader('X-Powered-By')

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET,POST')
    res.set('Access-Control-Allow-Headers', 'Authorization')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204)
    res.send('')
    return
  }

  try {
    let file

    switch (req.path.substr(1)) {
      case 'upload':
        if (!req.query.file) {
          throw new Error('The `file` parameter is missing.')
        }

        file = bucket.file(req.query.file)
        const [exists] = await file.exists()
        const [url] = await file.getSignedUrl({
          action: 'write',
          version: 'v4',
          expires: Date.now() + 600000 /* 10 min */,
        })

        res.type('application/json')
        res.send({ url, exists })
        break
      case 'list':
        const [files] = await bucket.getFiles()
        res.type('application/json')
        res.send(
          files.map(x => ({
            id: x.id,
            name: x.name,
            contentType: x.metadata.contentType,
            size: x.metadata.size,
            etag: x.metadata.etag,
            createdAt: x.metadata.timeCreated,
            updatedAt: x.metadata.updated,
          })),
        )
        break
      case 'get':
        if (!req.query.file) {
          throw new Error('The `file` parameter is missing.')
        }
        file = bucket.file(req.query.file)
        const [metadata] = await file.getMetadata()
        res.set({
          'Content-Type': metadata.contentType,
          'Content-Length': metadata.size,
          'Cache-Control': 'public, max-age=31557600, must-revalidate',
          'Last-Modified': new Date(metadata.timeCreated).toUTCString(),
          Expires: new Date(Date.now() + 31557600000).toUTCString(),
          ETag: `"${metadata.etag}"`,
        })
        res.removeHeader('Pragma')
        await new Promise((resolve, reject) => {
          file
            .createReadStream()
            .on('error', reject)
            .on('end', resolve)
            .pipe(res)
        })

        break

      case 'delete':
        if (!req.query.files) {
          throw new Error('The `files` parameter is missing.')
        }

        await Promise.all(
          (Array.isArray(req.query.files)
            ? req.query.files
            : [req.query.files]
          ).map(file => bucket.file(file).delete()),
        )

        res.type('text/plain')
        res.send('OK')
        break
      default:
        const err = new Error('Not found.')
        err.status = 404
        throw err
    }
  } catch (err) {
    console.error(err.message)
    res.status(err.status || 500)
    res.type('text/plain')
    res.send(err.message)
  }
}
