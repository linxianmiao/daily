Component({
  properties: {
    def: {
      type: Object,
      value: {},
    },
    defIdx: {
      type: Number,
      value: 0,
    },
  },

  methods: {
    onToggleLang() {
      this.triggerEvent('togglelang', { defIdx: this.data.defIdx });
    },
  },
});
