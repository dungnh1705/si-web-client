import { Component } from 'react'
import { load } from './config'

export default class ConfigLoader extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoaded: false }
  }

  componentDidMount() {
    // Once the configuration is loaded set `isLoaded` to true so we know to render our component
    load().then(config => this.setState({ isLoaded: true, config }))
  }

  render() {
    // If we haven't yet loaded the config, show either a "splash" component provided via a `loading` props or return nothing.
    if (!this.state.isLoaded) {
      return this.props.loading ? this.props.loading() : null
    }

    // The config is loaded so show the component set on the `ready()` props
    return this.props.ready(this.state.config)
  }
}
