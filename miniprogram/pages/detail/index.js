const api = require('../../utils/api');

Page({
  data: {
    keyword: '',
    history: [],
    statusBarHeight: 0,
    loading: true,
  },

  onLoad(options) {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      keyword: decodeURIComponent(options.keyword || ''),
    });
    this.loadHistory();
  },

  async loadHistory() {
    this.setData({ loading: true });
    try {
      const data = await api.getKeywordHistory(this.data.keyword, 7);
      this.setData({ history: data, loading: false });
    } catch (e) {
      console.error(e);
      this.setData({ loading: false });
    }
  },

  onBack() {
    wx.navigateBack();
  },
});
