function callCloud(type, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type, ...data },
      success(res) {
        resolve(res.result);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

function formatCount(n) {
  if (!n) return '';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function transformItem(kw) {
  if (!kw) return null;
  return {
    _id: kw._id,
    keyword: kw.keyword,
    definitions: (kw.definitions || []).map((d) => ({
      ...d,
      thumbsUpText: formatCount(d.thumbsUp),
    })),
    category: kw.category || 'General',
    source: kw.source || '',
  };
}

module.exports = {
  // 随机获取1条，排除已看过的
  getRandomItem(excludeIds = []) {
    return callCloud('getRandomItem', { excludeIds });
  },

  transformItem,
};
