module.exports = [
  {
    key: 'dashbaord',
    name: 'Dashboard',
    icon: 'important_devices',
    link: '/app/dashboard'
  },
  {
    key: 'countdowns',
    name: 'Countdowns',
    icon: 'timer',
    link: '/app/countdowns'
  },
  {
    key: 'requests',
    name: 'Requests',
    icon: 'send',
    link: '/app/requests'
  },
  {
    key: 'comments',
    name: 'Comments',
    icon: 'message',
    child: [
      {
        key: 'onCountdown',
        name: 'On Countdown',
        icon: 'timer',
        link: '/app/comments/countdown'
      },
      {
        key: 'onUser',
        name: 'On User',
        icon: 'person',
        link: '/app/comments/user'
      },
      {
        key: 'onRequest',
        name: 'On Reqeust',
        icon: 'send',
        link: '/app/comments/request'
      }
    ]
  },
  {
    key: 'users',
    name: 'Users',
    icon: 'supervisor_account',
    link: '/app/users'
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: 'settings',
    link: '/app/settings'
  }
];
