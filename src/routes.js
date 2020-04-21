import React from 'react';

// const Login = React.lazy(() => import('./views/Dashboard'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Rearing = React.lazy(() => import('./views/Rearing'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Recording = React.lazy(() => import('./views/Recording/Recording'));
const Monitor = React.lazy(() => import('./views/IoT/Monitor'));
const Sensor = React.lazy(() => import('./views/Sensor/Sensor'));
const Konfigurasi = React.lazy(() => import('./views/Konfigurasi/Konfigurasi'));

const Device = React.lazy(() => import('./views/IoT/Device'));
const Feed = React.lazy(() => import('./views/Feed/Feed'));
const FeedStock = React.lazy(() => import('./views/FeedStock/FeedStock'));
const House = React.lazy(() => import('./views/House/House'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/rearing', name: 'Periode Pemeliharaan', component: Rearing },
  { path: '/recording', name: 'Recording Pemeliharaan', component: Recording },
  { path: '/feedStock', name: 'Stok Pakan', component: FeedStock },
  // { path: '/iot/control', name: 'Kendalikan Alat Kandang', component: Control },
  { path: '/iot/monitor', name: 'Monitor Kandang', component: Device },
  { path: '/master/house', name: 'Master Kandang', component: House },
  { path: '/master/feed', name: 'Master Pakan', component: Feed },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/sensor', exact: true,  name: 'Sensor', component: Sensor },
  { path: '/configuration', exact: true,  name: 'Konfigurasi', component: Konfigurasi },
  { path: '/notification', exact: true,  name: 'Konfigurasi', component: Konfigurasi },
];

export default routes;
