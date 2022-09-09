export default {
  getFiles: async (storage, refPath) => {
    const pathReference = storage.ref(refPath)

    const resultRef = await pathReference.listAll()

    const promises = await resultRef.items.map(async itemRef => {
      const metaData = await itemRef.getMetadata()
      const url = await itemRef.getDownloadURL()
      return {
        fileName: metaData.name,
        url: url
      }
    })
    return await Promise.all(promises)
  },

  putFile: async (file, storage, refPath, fileName, isBase64 = false) => {
    if (isBase64) {
      return await storage.ref(refPath).child(fileName).putString(file, 'data_url')
    }

    const metadata = {
      contentType: file.type
    }

    return await storage.ref(refPath).child(fileName).put(file, metadata)
  }
}
