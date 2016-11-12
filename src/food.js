var foods = [];
AFRAME.registerComponent("food", {
  dependencies: ["ply-model", "position"],
  schema: {
    amount: {
      default: 2.0
    }
  },
  init: function() {
    this.data.maxAmount = this.data.amount;
    foods.push(this.el);
  },
  tick: function(time, delta) {
    if (this.data.amount >= this.data.maxAmount * 0.75) {
      this.el.setAttribute("ply-model", "src: #FoodFull");
    } else if (this.data.amount > 0) {
      this.el.setAttribute("ply-model", "src: #FoodMidFull");
    } else {
      this.el.setAttribute("ply-model", "src: #FoodEmpty");
    }
  }
});
