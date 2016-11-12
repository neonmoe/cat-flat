AFRAME.registerComponent("catmove", {
  dependencies: ["position", "rotation"],
  schema: {
    walking: {
      default: true
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
    if (this.data.targetPosition.x == -1 && this.data.targetPosition.y == -1
        && this.data.targetPosition.z == -1)
      this.data.targetPosition = this.el.getAttribute("position");
  },
  tick: function(time, delta) {
    delta = clamp(delta / 1000.0, 0.001, 0.03);
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
        var scaledMove = {x: this.data.moveSpeed * normMove.x * (delta),
                          z: this.data.moveSpeed * normMove.z * (delta)};
        this.data.walking = true;
        position.x += scaledMove.x;
        position.z += scaledMove.z;
        var angle = 180 * Math.atan2(normMove.x, normMove.z) / Math.PI + 90;
        var rotationSign = angle - rotation.y > 0 ? 1 : -1;
        rotation.y += (rotationSign) * delta * 720.0;
        if ((rotationSign > 0) != (angle - rotation.y > 0)) {
          rotation.y = angle;
        }
      }
    } else {
      this.data.walking = false;
    }

    // Apply changes to position and rotation
    this.el.setAttribute("position", {x: position.x, y: position.y, z: position.z});
    this.el.setAttribute("rotation", {x: rotation.x, y: rotation.y, z: rotation.z})
  }
});
