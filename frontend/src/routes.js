import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './components/Home/home';
import Layout from './hoc/Layout/layout';
import NewsArticle from './components/Articles/News/Post/index';
import VideosArticle from './components/Articles/Videos/Video/index';
import News from './components/News/news';
import Videos from './components/Videos/videos';
import SignIn from './components/SignIn/signin';

const PrivateRoute = ({
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
                    <PrivateRoute path="/sign-in" exact component={SignIn} />
                </Switch>
            </Layout>
        );
    }
}

export default Routes;