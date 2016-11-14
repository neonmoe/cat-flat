AFRAME.registerComponent("catai", {
  dependencies: ["catmove", "catanim", "position"],
  schema: {
    hunger: { default: 1.5 },
    hungerDelta: { default: 0.1 },
    hungerThreshold: { default: 1.0 },
    hungerSatiated: { default: 3.0 },
    targetFood: { },
    eatingSpeed: { default: 1 },
    activity: { default: "idle" },
    boredness: { default: 100 },
    boredDelta: { default: 1 },
    alive: { default: true }
  },
  init: function() {
    this.el.addEventListener("click", function() {
      this.el.dispatchEvent(new CustomEvent("meow"));
    });
  },
  tick: function(time, delta) {
    var position = this.el.getAttribute("position");
    delta = processDelta(delta);
    if (!this.data.alive) {
      position.y += delta * position.y;
      position.x += Math.sin(time / 1000.0 * Math.PI) * delta * (position.y / 5);
      position.z += Math.cos(time / 1000.0 * Math.PI) * delta * (position.y / 5);
      this.el.setAttribute("position", position);
      return;
    }
    this.data.hunger -= delta * this.data.hungerDelta;
    this.data.boredness += delta * this.data.boredDelta;

    // Reconsider activities possibly
    // 10% * boredness chance to reconsider activity every second
    if (this.data.boredness * delta * Math.random() > 0.1 ||
        // Reconsider if...
        // Currently eating but satiated
        (this.data.activity == "eating" && this.data.hunger > this.data.hungerSatiated) ||
        // Currently not eating but hungry
        (this.data.activity != "eating" && this.data.hunger < this.data.hungerThreshold) ||
        // Currently eating but no food in current target food cup
        (this.data.activity == "eating" && this.data.targetFood == null)) {
      if (Math.random() < 0.2) {
        this.el.dispatchEvent(new CustomEvent("meow"));
      }
      var activityReconsidered = false;
      this.data.boredness = 0;
      if (this.data.hunger < this.data.hungerThreshold) {
        var bestFood = null;
        var shortestLength = -1;
        for (var i = 0; i < foods.length; i++) {
          var foodAmount = foods[i].getComputedAttribute("food").amount;
          if (foodAmount > 0) {
            var foodPosition = foods[i].getAttribute("position");
            var deltaPosition = {x: foodPosition.x - position.x, z: foodPosition.z - foodPosition.z};
            var len = Math.sqrt(deltaPosition.x * deltaPosition.x + deltaPosition.z * deltaPosition.z);
            if (shortestLength == -1 || len < shortestLength) {
              shortestLength = len;
              bestFood = foods[i];
            }
          }
        }
        this.data.targetFood = bestFood;
        if (bestFood != null) {
          this.data.activity = "eating";
          activityReconsidered = true;
        }
      }
      if (!activityReconsidered) {
        if (this.data.activity == "eating") {
          this.data.activity = "wandering";
        } else {
          var idleActivityRoll = Math.round(Math.random() * 2) % 2;
          switch (idleActivityRoll) {
            case 0: this.data.activity = "wandering"; break;
            case 1: this.data.activity = "sitting"; break;
          }
        }
      }
    }

    // Implement activities
    // Eating
    if (this.data.activity == "eating" && this.data.targetFood != null) {
      var foodAmount = this.data.targetFood.getComputedAttribute("food").amount;
      if (foodAmount > 0) {
        var foodPosition = this.data.targetFood.getAttribute("position");
        var deltaPosition = {x: foodPosition.x - position.x, z: foodPosition.z - foodPosition.z};
        if (Math.sqrt(deltaPosition.x * deltaPosition.x + deltaPosition.z * deltaPosition.z) <= 0.1) {
          var eatingAmount = Math.min(foodAmount, delta * this.data.eatingSpeed);
          this.data.hunger += eatingAmount;
          this.data.targetFood.setAttribute("food", "amount", foodAmount - eatingAmount);
        } else {
          this.el.setAttribute("catmove", "targetPosition", {x: foodPosition.x, z: foodPosition.z});
          this.el.setAttribute("catmove", "targetReachDistance", 0.1);
        }
      } else {
        this.data.targetFood = null;
      }
    }
    // Wandering
    if (this.data.activity == "wandering" && !this.el.getComputedAttribute("catmove").walking) {
      this.el.setAttribute("catmove", "targetPosition", {x: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2});
      this.el.setAttribute("catmove", "targetReachDistance", 0.1);
    }

    // Die if dead
    if (this.data.hunger <= 0) {
      this.data.alive = false;
      this.el.setAttribute("catmove", "targetPosition", {x: position.x, z: position.z});
    }
  }
});
