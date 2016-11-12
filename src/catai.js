AFRAME.registerComponent("catai", {
  dependencies: ["catmove", "catanim"],
  schema: {
  },
  init: function() {
  },
  tick: function(time, delta) {
    if (!this.el.getComputedAttribute("catmove").walking) {
      this.el.setAttribute("catmove", "targetPosition", {x: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2});
    }
  }
});
