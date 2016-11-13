var foods = [];
AFRAME.registerComponent("food", {
  dependencies: ["ply-model", "position"],
  schema: {
    amount: {
      default: 2.0
    },
    maxAmount: {
      default: 2.0
    }
  },
  init: function() {
    this.data.maxAmount = this.data.amount;
    foods.push(this.el);
  },
  tick: function(time, delta) {
    this.el.setAttribute("scale", {x: 1, y: Math.floor(10.0 * (this.data.amount / this.data.maxAmount)) / 10.0, z: 1})
  }
});
