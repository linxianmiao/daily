Component({
  properties: {
    category: {
      type: String,
      value: 'en',
    },
  },

  methods: {
    onSwitch(e) {
      const cat = e.currentTarget.dataset.cat;
      this.triggerEvent('change', { category: cat });
    },
  },
});
