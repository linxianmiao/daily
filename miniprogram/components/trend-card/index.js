Component({
  properties: {
    keyword: { type: String, value: '' },
    definitions: { type: Array, value: [] },
    category: { type: String, value: '' },
  },
  methods: {
    onExploreInsights() {
      this.triggerEvent('explore', { keyword: this.data.keyword });
    },
  },
});
