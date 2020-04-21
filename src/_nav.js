export default {
    items: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
        },
        {
            title: true,
            name: 'Manajemen Kandang',
            wrapper: {
                element: '',
                attributes: {},
            },
        },
        {
            name: 'Periode Pemeliharaan',
            url: '/rearing',
            icon: 'icon-note'
        },
        {
            name: 'Recording',
            url: '/recording',
            icon: 'icon-calculator'
        },
        {
            name: 'Stok Pakan',
            url: '/feedStock',
            icon: 'icon-basket-loaded'
        },
        {
            name: 'Internet of Things',
            url: '/iot/monitor',
            icon: 'icon-feed'
        },
        {
            name: 'Master',
            url: '/master',
            icon: 'icon-doc',
            children: [
                {
                    name: 'Kandang',
                    url: '/master/house',
                    icon: 'icon-list',
                },
                {
                    name: 'Pakan',
                    url: '/master/feed',
                    icon: 'icon-list',
                }
            ]
        },

    ],
};
