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
  }
}
