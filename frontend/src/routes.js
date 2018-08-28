import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home/home';
import Layout from './hoc/Layout/layout';
import NewsArticle from './components/Articles/News/Post/index';
import VideosArticle from './components/Articles/Videos/Video/index';
import News from './components/News/news';
import Videos from './components/Videos/videos';
import SignIn from './components/SignIn/signin';
import Dashboard from './components/Dashboard/dashboard';
import PrivateRoute from './components/AuthRoutes/privateRoute';
import RestrictedRoute from './components/AuthRoutes/restrictedRoute';

const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/news" exact component={News}/>
                <Route path="/articles/:id" exact component={NewsArticle}/>
                <Route path="/videos/:id" exact render={(props) => (
                    <VideosArticle key={props.match.params.id} {...props} />
                    )}
                />
                <Route path="/videos" exact component={Videos}/>
                <RestrictedRoute path="/sign-in" exact component={SignIn}/>
                <PrivateRoute path="/dashboard" exact component={Dashboard}/>
            </Switch>
        </Layout>
    )
}

export default Routes;