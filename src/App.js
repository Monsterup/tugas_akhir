import React, { Component } from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './App.scss';
import auth from './auth';

function App(props) {
    const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
    const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
    const Login = React.lazy(() => import('./views/Auth/Login'));
    const Register = React.lazy(() => import('./views/Auth/Register'));
    const Page404 = React.lazy(() => import('./views/Pages/Page404'));
    const Page500 = React.lazy(() => import('./views/Pages/Page500'));

    return (
        <HashRouter>
            <ReactNotification/>
            <React.Suspense fallback={loading()}>
                <Switch>
                    <Route exact path={!auth.isAuthenticated() ? "/login" : "/"} name="Login Page"
                           render={props => <Login {...props}/>}/>
                    <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>}/>
                    <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>}/>
                    <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>}/>
                    <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>}/>
                </Switch>
            </React.Suspense>
        </HashRouter>
    );
}

export default App;
