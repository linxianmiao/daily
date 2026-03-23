App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-6g2p61z9ded5f6ed',
        traceUser: true,
      });
    }
  },
});
