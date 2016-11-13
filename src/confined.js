AFRAME.registerComponent("confined", {
  dependencies: ["position"],
  tick: function(time, delta) {
    var position = this.el.getAttribute("position");
    position.x = clamp(position.x, -1.15, 1.15);
    position.z = clamp(position.z, -1.15, 1.15);
  }
});
