Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/explore/index',
        text: 'EXPLORE',
        icon: 'compass',
      },
      {
        pagePath: '/pages/trending/index',
        text: 'TRENDING',
        icon: 'trending',
      },
      {
        pagePath: '/pages/insights/index',
        text: 'INSIGHTS',
        icon: 'insights',
      },
      {
        pagePath: '/pages/profile/index',
        text: 'PROFILE',
        icon: 'profile',
      },
    ],
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      wx.switchTab({
        url: data.path,
      });
    },
  },
});
