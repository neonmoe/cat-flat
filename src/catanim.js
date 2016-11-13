AFRAME.registerComponent("catanim", {
  dependencies: ["ply-model", "position"],
  schema: {
    offset: { default: -1 }
  },
  init: function() {
    if (this.data.offset == -1)
      this.data.offset = Math.random();
  },
  tick: function(time, delta) {
    var height = 0;
    var scaledTime = time / 150.0 + this.data.offset;
    var frame = Math.floor(scaledTime);
    if (this.el.getComputedAttribute("catmove").walking) {
      this.el.setAttribute("ply-model", "src: #CatW" + (frame % 2));
      var position = this.el.getAttribute("position");
      position.y = Math.sin(scaledTime * 2 * Math.PI) * 0.01 + 0.01;
      this.el.setAttribute("position", position);
    } else {
      var aiActivity = this.el.getComputedAttribute("catai").activity;
      if (aiActivity == "eating" || aiActivity == "sitting") {
        this.el.setAttribute("ply-model", "src: #CatSit");
      } else {
        this.el.setAttribute("ply-model", "src: #Cat");
      }
    }
  }
});
