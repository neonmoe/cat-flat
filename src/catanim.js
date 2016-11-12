AFRAME.registerComponent("catanim", {
  dependencies: ["ply-model", "position"],
  schema: {
    offset: {
      default: -1
    }
  },
  init: function() {
    if (this.data.offset == -1)
      this.data.offset = Math.random();
  },
  tick: function(time, delta) {
    var height = 0;
    if (this.el.getComputedAttribute("catmove").walking) {
      var scaledTime = time / 150.0 + this.data.offset;
      var frame = Math.floor(scaledTime) % 2;
      this.el.setAttribute("ply-model", "src: #CatW" + frame);

      var position = this.el.getAttribute("position");
      position.y = Math.sin(scaledTime * 2 * Math.PI) * 0.01 + 0.01;
      this.el.setAttribute("position", position);
    } else {
      this.el.setAttribute("ply-model", "src: #Cat");
    }
  }
});
