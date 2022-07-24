const config = {}
export default config

function load() {
  return fetch('/config/config.json')
    .then(result => result.json())
    .then(newconfig => {
      for (let prop in config) {
        delete config[prop]
      }
      for (let prop in newconfig) {
        config[prop] = newconfig[prop]
      }
      return config
    })
}
export { load }
