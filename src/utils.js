function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function processDelta(delta) {
  return Math.min(delta / 1000.0, 0.03);
}

function spawnEntity(attribs) {
  var entity = document.createElement("a-entity");
  for (var i = 0; i < attribs.length; i++) {
    entity.setAttribute(attribs[i][0], attribs[i][1]);
  }
  document.querySelector("a-scene").appendChild(entity);
}

function spawnCat(position, rotation) {
  position = position || {x: (Math.random() - 0.5) * 2, y: 0, z: (Math.random() - 0.5) * 2};
  rotation = rotation || {x: -90, y: Math.random() * 360, z: 0};
  spawnEntity([["ply-model", "src: #Cat"], ["position", position],
              ["rotation", rotation], ["scale", {x: 0.02, y: 0.02, z: 0.02}],
              ["catmove", ""], ["catanim", ""], ["catai", ""], ["confined", ""]]);
}

function spawnFood(position, rotation) {
  position = position || {x: (Math.random() - 0.5) * 0.75 + (Math.floor(Math.random() * 3) - 1) * 0.91,
                    y: 0, z: (Math.random() - 0.5) * 0.75 + (Math.floor(Math.random() * 3) - 1) * 0.91};
  rotation = rotation || {x: 0, y: Math.floor(Math.random() * 8) * 45, z: 0};
  spawnEntity([["collada-model", "#Food"], ["position", {x: position.x, y: 0.0249, z: position.z}],
              ["rotation", rotation], ["food", ""]]);
  spawnEntity([["collada-model", "#FoodCup"], ["position", position],
              ["rotation", rotation], ["foodcup", ""]]);
}
