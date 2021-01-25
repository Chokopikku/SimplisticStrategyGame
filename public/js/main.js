// Date
day = 0

// Population
population_babies = 0
population_adults = 10
population_total = 10
population_free = 10
population_max = 10
hunger = 0.4
thirst = 0.2
childbirth_chance = 5 // in percentage

// Structures
houses = 2
house_cost = [20, 60]
house_cost_increase = [5, 20]

// Resources
food = 200
water = 200
wood = 0
stone = 0
ideas = 0

// Jobs
farmers = 0
food_per_farmer = 1
woodcutters = 0
wood_per_woodcutter = 0.5
miners = 0
stone_per_miner = 0.5
diggers = 0
res_per_digger = 0.5
hunters = 0
food_per_hunter = 0.5
leather_per_hunter
thinkers = 0
ideas_per_thinker = 0.5

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
   document.getElementById('water').innerHTML = water
   document.getElementById('wood').innerHTML = wood
   document.getElementById('stone').innerHTML = stone
   document.getElementById('ideas').innerHTML = ideas
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
   dlogRes("Wood", wood_diff)
   food_diff = farmers * food_per_farmer - population_total * hunger
   food += food_diff
   food = Math.round((food + Number.EPSILON) * 100) / 100
   dlogRes("Food", food_diff)
   water_diff = -population_total * thirst
   water += water_diff
   water = Math.round((water + Number.EPSILON) * 100) / 100
   dlogRes("Water", water_diff)
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

function dlogRes(name, val) {
   msg = name + ": " + (val<0?"":"+") + val
   dlog(msg)
}

function dlog(msg) {
   document.getElementById('dlog').innerHTML += msg + "&#13;&#10"
}

function dlogReset() {
   document.getElementById('dlog').innerHTML = ""
}
