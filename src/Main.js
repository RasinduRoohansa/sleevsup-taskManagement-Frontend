import React from 'react'
import Dashboard from './Dashboard';
class Main extends React.Component{
    render() {
        return <Dashboard  api={this.props.api}/>
    }
}

export default Main
