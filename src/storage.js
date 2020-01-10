const baseUrl = 'https://us-central1-kriasoft.cloudfunctions.net'

const listPath = '/storage-demo/list'
const uploadPath = '/storage-demo/upload'
const deletePath = '/storage-demo/delete'

export default {
  getFiles() {
    const url = new URL(listPath, baseUrl)
    return fetch(url).then(x => x.json())
  },

  async upload(file) {
    // Obtain the upload URL.
    // See /functions/storage-demo/index.js
    const url = new URL(uploadPath, baseUrl)
    url.searchParams.set('file', file.name)
    const res = await fetch(url, { method: 'POST', credentials: 'include' })
    const { url: uploadUrl } = await res.json()

    // Push the file to that URL
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.open('PUT', uploadUrl, true)
      req.onload = event => {
        resolve(file)
      }
      req.onerror = err => {
        reject(err)
      }
      req.send(file)
    })
  },

  delete(files) {
    const url = new URL(deletePath, baseUrl)
    files.forEach(file => url.searchParams.append('files', file))
    return fetch(url)
  },
}
