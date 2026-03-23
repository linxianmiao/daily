const api = require('../../utils/api');

Page({
  data: {
    trendingList: [],
    platforms: api.platforms,
    currentPlatform: 'all',
    statusBarHeight: 0,
    loading: true,
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sysInfo.statusBarHeight });
    this.loadTrending();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  async loadTrending() {
    this.setData({ loading: true });
    try {
      const data = await api.getTrending(this.data.currentPlatform, 30);
      this.setData({ trendingList: data, loading: false });
    } catch (e) {
      console.error(e);
      this.setData({ loading: false });
    }
  },

  onPlatformChange(e) {
    const platform = e.currentTarget.dataset.platform;
    this.setData({ currentPlatform: platform });
    this.loadTrending();
  },
});
