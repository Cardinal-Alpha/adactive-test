
export const menu = {
    logo: '/shopping-cart-logo.png',
    model:[
        {
            label: 'Home',
            url: '/dashboard'
        },
        {
            label: 'Inventory',
            items: [
                {
                    label: 'Storage Management',
                    url: '/inventory/storage'
                },
                {
                    label: 'Check In Log',
                    url: '/inventory/checkin'
                },
                {
                    label: 'Check Out Log',
                    url: '/inventory/checkout'
                }
            ]
        },
        {
            label: 'Profile',
            url: '/profile'
        }
    ]
}