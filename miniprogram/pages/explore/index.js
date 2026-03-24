const api = require('../../utils/api');

Page({
  data: {
    slots: [null, null, null],
    currentIndex: 1,
    scrollTops: [0, 0, 0],
    loading: true,
  },

  // 已看过的 _id，避免重复
  seenIds: [],

  onLoad() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-6g2p61z9ded5f6ed',
        traceUser: true,
      });
    }
    this.initLoad();
  },

  async initLoad() {
    this.setData({ loading: true });
    try {
      // 加载当前 + 下一个
      const cur = await this.fetchOne();
      const next = await this.fetchOne();
      this.setData({
        slots: [null, cur, next],
        currentIndex: 1,
        loading: false,
      });
    } catch (e) {
      console.error('[explore] 初始化失败:', e);
      this.setData({ loading: false });
    }
  },

  async fetchOne() {
    try {
      const res = await api.getRandomItem(this.seenIds);
      if (res.item) {
        const card = api.transformItem(res.item);
        this.seenIds.push(card._id);
        return card;
      }
      // 所有词都看过了，重置
      console.log('[explore] 所有词条已看完，重置');
      this.seenIds = [];
      const retry = await api.getRandomItem([]);
      if (retry.item) {
        const card = api.transformItem(retry.item);
        this.seenIds.push(card._id);
        return card;
      }
    } catch (e) {
      console.error('[explore] 获取词条失败:', e);
    }
    return null;
  },

  toggleLang(e) {
    const { slotIdx, defIdx } = e.currentTarget.dataset;
    const key = `slots[${slotIdx}].definitions[${defIdx}].showZh`;
    const current = this.data.slots[slotIdx].definitions[defIdx].showZh;
    this.setData({ [key]: !current });
  },

  async onSwiperChange(e) {
    const newIdx = e.detail.current;
    const oldIdx = this.data.currentIndex;

    if (newIdx === oldIdx) return;

    // 判断滑动方向: swiper 是 circular 的，0→2 是向上(prev)，其他按差值判断
    const diff = newIdx - oldIdx;
    const isNext = diff === 1 || diff === -2; // 向下滑(看下一个)

    if (isNext) {
      const nextCard = await this.fetchOne();
      const slots = [...this.data.slots];
      const scrollTops = [...this.data.scrollTops];
      const nextSlot = (newIdx + 1) % 3;
      slots[nextSlot] = nextCard;
      scrollTops[nextSlot] = 0;
      this.setData({ slots, scrollTops, currentIndex: newIdx });
    } else {
      this.setData({ currentIndex: newIdx });
    }
  },
});
