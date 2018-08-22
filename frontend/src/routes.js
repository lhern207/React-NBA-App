import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home/home';
import Layout from './hoc/Layout/layout';
import NewsArticle from './components/Articles/News/Post/index';
import VideosArticle from './components/Articles/Videos/Video/index';
import News from './components/News/news';
import Videos from './components/Videos/videos';
import SignIn from './components/SignIn/signin';
import Dashboard from './components/Dashboard/dashboard';
import axios from 'axios';
import {BACKEND_API} from './config';

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

const PrivateRoute = ({
    component: Comp,
    ...rest
}) => {
    return (
        <Route {...rest} component={(props)=>{
            axios.post(`${BACKEND_API}/dashboard`, {}, {withCredentials: true})
            .then(response => {
                if(sessionStorage.getItem('loggedIn') === 'true'){
                    return (
                        <Comp {...props}/>
                    )
                }
                else{
                    return (
                        <Redirect to="/sign-in"/>
                    )
                }
            })
            .catch(e=>{
                //sessionStorage.removeItem('loggedIn');
                //sessionStorage.removeItem('email');
                return (
                    <Redirect to="/sign-in"/>
                )
            });
        }}
        />
    )
};

class Routes extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/news" exact component={News}/>
                    <Route path="/articles/:id" exact component={NewsArticle}/>
                    <Route path="/videos/:id" exact component={VideosArticle}/>
                    <Route path="/videos" exact component={Videos}/>
                    <RestrictedRoute path="/sign-in" exact component={SignIn}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                </Switch>
            </Layout>
        )
    }
}

export default Routes;