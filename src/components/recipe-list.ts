import { Recipe } from "../../types/recipe"
import RecipeCardComponent from "./recipe-card"

export default class RecipeListComponent {
  recipeListElement!: HTMLDivElement
  recipes!: Recipe[]

  constructor(recipes: Recipe[]) {
    this.recipes = recipes
    this.recipeListElement = document.querySelector(
      "#recipes"
    ) as HTMLDivElement
    this.render()
    this.bindFilterEvent()
  }

  bindFilterEvent(): void {
    document.addEventListener("filter", (event: any) => {
      this.recipes = event.detail
      this.render()
    })
  }

  render(): void {
    this.recipeListElement.innerHTML = ""
    this.recipes.forEach((recipe) => {
      const recipeCard = new RecipeCardComponent(recipe)
      this.recipeListElement.innerHTML += recipeCard.template
    })
  }
}
