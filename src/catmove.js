AFRAME.registerComponent("catmove", {
  dependencies: ["position", "rotation"],
  schema: {
    walking: { default: true },
    targetPosition: {
      type: "vec3",
      default: { x: -1, y: -1, z: -1 }
    },
    targetReachDistance: { default: 0.01 },
    moveSpeed: { default: 1 }
  },
  init: function() {
    if (this.data.targetPosition.x == -1 && this.data.targetPosition.y == -1
        && this.data.targetPosition.z == -1)
      this.data.targetPosition = this.el.getAttribute("position");
  },
  tick: function(time, delta) {
    delta = processDelta(delta);
    // Get position and rotation so changes can be applied
    var position = this.el.getAttribute("position");
    var rotation = this.el.getAttribute("rotation");

    var move = {x: this.data.targetPosition.x - position.x,
                z: this.data.targetPosition.z - position.z};
    if (move.x != 0 || move.z != 0) {
      var len = Math.sqrt(move.x * move.x + move.z * move.z);
      if (len < this.data.targetReachDistance) {
        var tp = this.data.targetPosition;
        this.data.walking = false;
      } else {
        var normMove = {x: move.x / len, z: move.z / len};
        var angle = 180 * Math.atan2(normMove.x, normMove.z) / Math.PI + 90;
        var rotationSign = angle - rotation.y > 0 ? 1 : -1;
        rotation.y += (rotationSign) * delta * 720.0;
        if ((rotationSign > 0) != (angle - rotation.y > 0)) {
          rotation.y = angle;
        }
        position.x += ((Math.sin(angle) + normMove.x) / 2) * this.data.moveSpeed * delta;
        position.z += ((Math.cos(angle) + normMove.z) / 2) * this.data.moveSpeed * delta;
        this.data.walking = true;
      }
    } else {
      this.data.walking = false;
    }

    // Apply changes to position and rotation
    this.el.setAttribute("position", {x: position.x, y: position.y, z: position.z});
    this.el.setAttribute("rotation", {x: rotation.x, y: rotation.y, z: rotation.z});
  }
});
