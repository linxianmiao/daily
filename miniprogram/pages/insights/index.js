const api = require('../../utils/api');

Page({
  data: {
    aiTopics: [],
    categories: [],
    statusBarHeight: 0,
    loading: true,
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sysInfo.statusBarHeight });
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      const [aiTopics, categories] = await Promise.all([
        api.getAiTopics().catch(() => []),
        api.getCategories().catch(() => []),
      ]);
      this.setData({ aiTopics, categories, loading: false });
    } catch (e) {
      console.error(e);
      this.setData({ loading: false });
    }
  },
});
