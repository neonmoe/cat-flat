AFRAME.registerComponent("catai", {
  dependencies: ["catmove", "catanim", "position"],
  schema: {
    hunger: {
      default: 1.5
    },
    hungerDelta: {
      default: 0.1
    },
    eatingSpeed: {
      default: 10
    }
  },
  init: function() {
  },
  tick: function(time, delta) {
    delta = processDelta(delta);
    this.data.hunger -= delta * this.data.hungerDelta;
    var position = this.el.getAttribute("position");
    if (this.data.hunger < 1) {
      for (var i = 0; i < foods.length; i++) {
        var foodAmount = foods[i].getComputedAttribute("food").amount;
        if (foodAmount > 0) {
          var foodPosition = foods[i].getAttribute("position");
          var deltaPosition = {x: foodPosition.x - position.x, z: foodPosition.z - foodPosition.z};
          if (Math.sqrt(deltaPosition.x * deltaPosition.x + deltaPosition.z * deltaPosition.z) <= 0.2) {
            var eatingAmount = Math.min(foodAmount, delta * this.data.eatingSpeed);
            this.data.hunger += eatingAmount;
            foods[i].setAttribute("food", "amount", foodAmount - eatingAmount);
          } else {
            this.el.setAttribute("catmove", "targetPosition", {x: foodPosition.x, z: foodPosition.z});
            this.el.setAttribute("catmove", "targetReachDistance", 0.2);
          }
          break;
        }
      }
    } else if (Math.random() < 0.05 && !this.el.getComputedAttribute("catmove").walking) {
      this.el.setAttribute("catmove", "targetPosition", {x: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2});
      this.el.setAttribute("catmove", "targetReachDistance", 0.1);
    }
  }
});
