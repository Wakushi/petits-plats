import RecipeCardComponent from "./recipe-card"
import { RecipeRegistry } from "../recipe-registry"

export default class RecipeListComponent {
  recipeListElement: HTMLDivElement
  registry: RecipeRegistry

  constructor(registry: RecipeRegistry) {
    this.registry = registry
    this.recipeListElement = document.querySelector(
      "#recipes"
    ) as HTMLDivElement
    this._render()
    this._bindEvents()
    this._updateRecipeCount(this.registry.filteredRecipes.length)
  }

  private _bindEvents(): void {
    document.addEventListener("stateChange", () => {
      this._render()
    })
  }

  private _render(): void {
    this.recipeListElement.innerHTML = ""

    if (
      !this.registry.filteredRecipes.length &&
      this.registry.searchKeyword.length >= 3
    ) {
      this.recipeListElement.innerHTML = `
        <div class="text-center text-2xl font-bold mt-8 text-black absolute">
          Aucune recette ne contient '${this.registry.searchKeyword}' Vous pouvez
          chercher « tarte aux pommes », « poisson », etc.
        </div>
      `
      return
    }

    this.registry.filteredRecipes.forEach((recipe) => {
      const recipeCard = new RecipeCardComponent(recipe)
      this.recipeListElement.innerHTML += recipeCard.template
    })

    this._updateRecipeCount(this.registry.filteredRecipes.length)
  }

  private _updateRecipeCount(count: number): void {
    document.querySelector("#recipeCount")!.textContent = count.toString()
  }
}
