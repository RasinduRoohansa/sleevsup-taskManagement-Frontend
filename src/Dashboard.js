import React from 'react';
import TaskLog from './TaskLog'

export default class extends React.Component {
        render(){
            return(
                <div>
                    <div>
                        <TaskLog api={this.props.api}/>
                    </div>
                </div>
            )
        }
}
