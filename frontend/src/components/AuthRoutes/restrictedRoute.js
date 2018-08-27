import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RestrictedRoute = ({
    component: Comp,
    ...rest
}) => {
    return (
        <Route {...rest} component={(props)=>{
            return (
                sessionStorage.getItem('loggedIn') === 'true' ? 
                <Redirect to="/"/>
                :
                <Comp {...props}/>
            )
        }}/>
    )
};

export default RestrictedRoute;