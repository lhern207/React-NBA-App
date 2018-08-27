import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_API } from '../../config';

class PrivateRoute extends Component {
    state = {
        authorized: 'pending'
    }

    componentDidMount(){
        axios.post(`${BACKEND_API}/dashboard`, {}, {withCredentials: true})
        .then(response => {
            this.setState({
                authorized : 'true'
            });
        })
        .catch(e => {
            this.setState({
                authorized : 'false'
            })
        });
    }

    render(){
        const {component:Comp, ...rest} = this.props; 

        return (
            <Route  {...rest} component={(props)=>{
                if(sessionStorage.getItem('loggedIn') === 'true' && this.state.authorized === 'pending'){
                    return (
                        <div>...loading</div>
                    )
                }
                else if(sessionStorage.getItem('loggedIn') === 'true' && this.state.authorized === 'true'){
                    return (
                        <Comp {...props}/>
                    )
                }
                else{
                    sessionStorage.removeItem('loggedIn');
                    sessionStorage.removeItem('email');
                    return (
                        <Redirect to="/sign-in"/>
                    )
                }
            }}/>
        )
    }
};

export default PrivateRoute;