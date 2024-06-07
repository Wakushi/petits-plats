import { Recipe } from "../../types/recipe"
import RecipeCardComponent from "./recipe-card"

export default class RecipeListComponent {
  recipeListElement: HTMLDivElement
  recipes: Recipe[]

  constructor(recipes: Recipe[]) {
    this.recipes = recipes
    this.recipeListElement = document.querySelector(
      "#recipes"
    ) as HTMLDivElement
    this.render()
    this.bindFilterEvent()
    this.updateRecipeCount(this.recipes.length)
  }

  bindFilterEvent(): void {
    document.addEventListener("filter", (event: any) => {
      this.recipes = event.detail.recipes
      this.updateRecipeCount(this.recipes.length)
      this.render(event.detail.keyword)
    })
  }

  render(keyword: string = ""): void {
    this.recipeListElement.innerHTML = ""

    if (!this.recipes.length && keyword.length >= 3) {
      this.recipeListElement.innerHTML = `
        <div class="text-center text-2xl font-bold mt-8 text-black absolute">
          Aucune recette ne contient '${keyword}' Vous pouvez
          chercher « tarte aux pommes », « poisson », etc.
        </div>
      `
      return
    }

    this.recipes.forEach((recipe) => {
      const recipeCard = new RecipeCardComponent(recipe)
      this.recipeListElement.innerHTML += recipeCard.template
    })
  }

  updateRecipeCount(count: number): void {
    document.querySelector("#recipeCount")!.textContent = count.toString()
  }
}
