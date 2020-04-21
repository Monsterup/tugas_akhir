import React, {Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import * as router from 'react-router-dom';
import {Container} from 'reactstrap';

import {
    AppAside,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppBreadcrumb2 as AppBreadcrumb,
    AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
import navigationDef from '../../_nav';
import navigationAds from '../../_nav_ads';
import routes from '../../routes';
import auth from "../../auth";

navigationDef.items.push(navigationAds.items[0]);
navigationDef.items.push(navigationAds.items[1]);

function DefaultLayout(props) {
    const DefaultAside = React.lazy(() => import('./DefaultAside'));
    const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
    const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
    const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;
    if (!auth.isAuthenticated()) {
        props.history.push('/login')
    }
    // if (auth.isAuthenticated() && !auth.isRegistered()) {
    //     props.history.push('/register')
    // }
    const signOut = () => {
        auth.logout();
        props.history.push('/login');
    }
    return (
        <div className="app">
            <AppHeader fixed>
                <Suspense fallback={loading()}>
                    <DefaultHeader onLogout={signOut}/>
                </Suspense>
            </AppHeader>
            <div className="app-body">
                <AppSidebar fixed display="lg">
                    <AppSidebarHeader/>
                    <AppSidebarForm/>
                    <Suspense>
                        <AppSidebarNav navConfig={navigationDef} {...props} router={router}/>
                    </Suspense>
                    <AppSidebarFooter/>
                    <AppSidebarMinimizer/>
                </AppSidebar>
                <main className="main">
                    <AppBreadcrumb appRoutes={routes} router={router}/>
                    <Container fluid>
                        <Suspense fallback={loading()}>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props} />
                                            )}/>
                                    );
                                })}
                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Suspense>
                    </Container>
                </main>
                <AppAside fixed>
                    <Suspense fallback={loading()}>
                        <DefaultAside/>
                    </Suspense>
                </AppAside>
            </div>
        </div>
    );
}

export default DefaultLayout;
