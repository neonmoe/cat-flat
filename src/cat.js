AFRAME.registerComponent("cat", {
  dependencies: ["ply-model"],
  schema: {
    walking: {
      default: true
    },
    offset: {
      default: -1
    },
    targetPosition: {
      type: "vec3",
      default: { x: -1, y: -1, z: -1 }
    },
    moveSpeed: {
      default: 1
    }
  },
  init: function() {
    if (this.data.offset == -1)
      this.data.offset = Math.random();
    if (this.data.targetPosition.x == -1 && this.data.targetPosition.y == -1
        && this.data.targetPosition.z == -1)
      this.data.targetPosition = this.el.getAttribute("position");
  },
  tick: function(time, delta) {
    // Get position and rotation so changes can be applied
    var position = this.el.getAttribute("position");
    var rotation = this.el.getAttribute("rotation");

    var move = {x: this.data.targetPosition.x - position.x,
                z: this.data.targetPosition.z - position.z};
    if (move.x != 0 || move.z != 0) {
      var len = Math.sqrt(move.x * move.x + move.z * move.z);
      if (len < 0.1) {
        position = this.data.targetPosition;
        this.data.walking = false;
      } else {
        var normMove = {x: move.x / len, z: move.z / len};
        var scaledMove = {x: this.data.moveSpeed * normMove.x * (delta / 1000.0),
                          z: this.data.moveSpeed * normMove.z * (delta / 1000.0)};
        this.data.walking = true;
        position.x += scaledMove.x;
        position.z += scaledMove.z;
        var angle = 180 * Math.atan2(normMove.x, normMove.z) / Math.PI + 90;
        rotation.y += (angle - rotation.y) * (delta / 100.0);
      }
    } else {
      this.data.walking = false;
      this.data.targetPosition = {x: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2};
      console.log("New position! x: " + this.data.targetPosition.x + ", z: " + this.data.targetPosition.z);
    }

    var height = 0;
    if (this.data.walking) {
      var scaledTime = time / 150.0 + this.data.offset;
      var frame = Math.floor(scaledTime) % 2;
      position.y = 0.06 + Math.sin(scaledTime * 2 * Math.PI) * 0.01 + 0.01;
      this.el.setAttribute("ply-model", "src: #CatW" + frame);
    } else {
      this.el.setAttribute("ply-model", "src: #Cat");
    }

    // Apply changes to position and rotation
    this.el.setAttribute("position", {x: position.x, y: position.y, z: position.z});
    this.el.setAttribute("rotation", {x: rotation.x, y: rotation.y, z: rotation.z})
  }
});
