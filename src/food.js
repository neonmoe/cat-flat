var foods = [];
AFRAME.registerComponent("food", {
  dependencies: ["ply-model", "position"],
  schema: {
    amount: { default: 5.0 },
    maxAmount: { default: 5.0 }
  },
  init: function() {
    this.data.maxAmount = this.data.amount;
    foods.push(this.el);
    this.el.addEventListener("click", function() {
      this.setAttribute("food", "amount", this.getComputedAttribute("food").maxAmount);
    });
  },
  tick: function(time, delta) {
    this.el.setAttribute("scale", {x: 1, y: Math.floor(10.0 * (this.data.amount / this.data.maxAmount)) / 10.0, z: 1})
  }
});
