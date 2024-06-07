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
  }

  bindFilterEvent(): void {
    document.addEventListener("filter", (event: any) => {
      this.recipes = event.detail.recipes
      this.render(event.detail.keyword)
    })
  }

  render(keyword: string = ""): void {
    this.recipeListElement.innerHTML = ""
    if (!this.recipes.length && keyword.length >= 3) {
      this.recipeListElement.innerHTML = `
        <div class="text-center text-2xl font-bold mt-8 text-black">
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
}

// When creating the selects, create mapping to index recipe by filter of the select
