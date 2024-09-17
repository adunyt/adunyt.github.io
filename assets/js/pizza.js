class Pizza{
    constructor(diametr, icon) {
        this.diametr = diametr;
        this.icon = icon;
      }
      get icon(){
        return this.icon;
      }
      get area(){
        return this.calcArea();
      }
      // formula to calculate circle area from diamert
      calcArea(){
        return 1/4 * Math.PI * Math.pow(this.diametr, 2) 
      }
}

const small_pizza = Pizza(
    diametr=document.getElementById("small-pizza-diametr-input").value,
    icon=document.getElementById("small-pizza-icon")
)

const medium_pizza = Pizza(
    diametr=document.getElementById("medium-pizza-diametr-input").value,
    icon=document.getElementById("medium-pizza-icon")
)

const large_pizza = Pizza(
    diametr=document.getElementById("large-pizza-diametr-input").value,
    icon=document.getElementById("large-pizza-icon")
)

const small_pizza_count_input = document.getElementById("small-pizza-count-input")
const medium_pizza_count_input = document.getElementById("medium-pizza-count-input")
const large_pizza_count_input = document.getElementById("large-pizza-count-input")




function calcTotalArea(){
    let totalArea = 0;
    totalArea += small_pizza.area * small_pizza_count;
    totalArea += medium_pizza.area * medium_pizza_count;
    totalArea += large_pizza.area * large_pizza_count;
    return totalArea;
}

calcTotalArea()