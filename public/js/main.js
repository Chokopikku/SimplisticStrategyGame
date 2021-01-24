// Date
day = 1

// Population
population_total = 10
population_free = 10
population_max = 10
feed_per_individual = 0.2
childbirth_chance = 5 // in percentage

// Structures
houses = 2
house_cost = [20, 60]
house_cost_increase = [5, 20]

// Resources
food = 200
wood = 0

// Jobs
farmers = 0
food_per_farmer = 1
woodcutters = 0
wood_per_woodcutter = 0.5

function init() {
  updatePopulation()
  updateStructures()
  updateResources()
  updateWorkers()
}

function updatePopulation() {
  document.getElementById('population_free').innerHTML = population_free
  document.getElementById('population_total').innerHTML = population_total
  document.getElementById('population_max').innerHTML = population_max
}

function updateStructures() {
  document.getElementById('houses').innerHTML = houses
}

function updateResources() {
  document.getElementById('food').innerHTML = food
  document.getElementById('wood').innerHTML = wood
}

function updateWorkers() {
  document.getElementById('farmers').value = farmers
  document.getElementById('farmers').max = Number(farmers) + Number(population_free)
  document.getElementById('woodcutters').value = woodcutters
  document.getElementById('woodcutters').max = Number(woodcutters) + Number(population_free)
}

function updateAll() {
  updatePopulation()
  updateStructures()
  updateResources()
  updateWorkers()
}

function adjustWorkers() {
  farmers = document.getElementById('farmers').value
  woodcutters = document.getElementById('woodcutters').value
  population_free = population_total - farmers - woodcutters
  updatePopulation()
  updateWorkers()
}

function buildHouse() {
  if (food >= house_cost[0] && wood >= house_cost[1]) {
    food -= house_cost[0]
    wood -= house_cost[1]
    houses++
    population_max += 5
    for (var i = 0; i < house_cost.length; i++) {
      house_cost[i] = house_cost[i] + house_cost_increase[i]
      document.getElementById('house_cost_'+i).innerHTML = house_cost[i]
    }
    updateAll()
  }
}

function tick(preserveLog = false) {
  if (!preserveLog) {
    dlogReset()
  }
  dlog("Day " + ++day + ":")
  wood_diff = woodcutters * wood_per_woodcutter
  wood += wood_diff
  dlog("Wood: +" + wood_diff)
  food_diff = farmers * food_per_farmer - population_total * feed_per_individual
  food += food_diff
  food = Math.round((food + Number.EPSILON) * 100) / 100
  dlog("Food: " + (food_diff<0?"":"+") + food_diff)
  for (var i = 0; i < (population_total / 2) && population_total < population_max; i++) {
    roll = Math.floor((Math.random() * 100) + 1)
    if (roll <= childbirth_chance) {
      dlog("A baby was born!");
      population_total++
      adjustWorkers()
    }
  }
  updateResources()
}

function tick10() {
  for (var i = 0; i < 10; i++) {
    tick(true)
  }
}

function dlog(msg) {
  document.getElementById('dlog').innerHTML += msg + "&#13;&#10"
}

function dlogReset() {
  document.getElementById('dlog').innerHTML = ""
}
