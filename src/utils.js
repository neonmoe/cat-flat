function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function len(vec) {
  vec.x = vec.x || 0;
  vec.y = vec.y || 0;
  vec.z = vec.z || 0;
  return ;
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
  var hungerDelta = 0.05 + Math.random() * 0.2;
  var eatingSpeed = 0.5 + Math.random() * 1.2;
  var boredDelta = 0.2 + Math.random() * 3.0;
  var hungerSatiated = 1.25 + Math.random() * 4.0;
  var hungerThreshold = 0.6 + Math.random() * 0.7;
  var hunger = 0.8 + Math.random() * 1.2;
  spawnEntity([["ply-model", "src: #Cat"], ["position", position],
              ["rotation", rotation], ["scale", {x: 0.02, y: 0.02, z: 0.02}],
              ["sound", "src: #meow" + Math.floor(Math.random() * 4) + "; on: meow"], ["catmove", ""], ["catanim", ""],
              ["catai", "hungerDelta: " + hungerDelta +
                        ";eatingSpeed: " + eatingSpeed +
                        ";boredDelta: " + boredDelta +
                        ";hungerSatiated: " + hungerSatiated +
                        ";hungerThreshold: " + hungerThreshold +
                        ";hunger: " + hunger],
              ["confined", ""]]);
}

var spawnedFoodPositions = [];
function spawnFood(position, rotation) {
  function genPosition() {
    return {x: (Math.random() - 0.5) * 0.6 + (Math.floor(Math.random() * 3) - 1) * 0.91,
      y: 0, z: (Math.random() - 0.5) * 0.6 + (Math.floor(Math.random() * 3) - 1) * 0.91};
  }
  position = position || genPosition();
  // If a proper position can't be found in 100 tries, the position might as
  // well be not proper, because someone screwed up somewhere.
  for (var i = 0; i < 100; i++) {
    var notCloseToAnything = true;
    for (var j = 0; j < spawnedFoodPositions.length; j++) {
      var delta = {x: spawnedFoodPositions[j].x - position.x, z: spawnedFoodPositions[j].z - position.z};
      if (Math.sqrt(delta.x * delta.x + delta.z * delta.z) < 0.3) {
        notCloseToAnything = false;
        break;
      }
    }
    if (notCloseToAnything) {
      break;
    } else {
      position = genPosition();
    }
  }
  spawnedFoodPositions.push(position);
  rotation = rotation || {x: 0, y: Math.floor(Math.random() * 8) * 45, z: 0};
  spawnEntity([["collada-model", "#Food"], ["position", {x: position.x, y: 0.0249, z: position.z}],
              ["rotation", rotation], ["food", ""], ["sound", "src: #nom; volume: 0.1; on: nom"]]);
  spawnEntity([["collada-model", "#FoodCup"], ["position", position],
              ["rotation", rotation], ["foodcup", ""]]);
}
