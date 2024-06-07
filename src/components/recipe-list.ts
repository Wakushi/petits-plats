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
    this.render()
    this.bindFilterEvent()
    this._updateRecipeCount(this.registry.filteredRecipes.length)
  }

  bindFilterEvent(): void {
    document.addEventListener("filter", (event: any) => {
      this._onRecipesUpdate(event.detail.keyword)
    })
  }

  render(keyword: string = ""): void {
    this.recipeListElement.innerHTML = ""

    if (!this.registry.filteredRecipes.length && keyword.length >= 3) {
      this.recipeListElement.innerHTML = `
        <div class="text-center text-2xl font-bold mt-8 text-black absolute">
          Aucune recette ne contient '${keyword}' Vous pouvez
          chercher « tarte aux pommes », « poisson », etc.
        </div>
      `
      return
    }

    this.registry.filteredRecipes.forEach((recipe) => {
      const recipeCard = new RecipeCardComponent(recipe)
      this.recipeListElement.innerHTML += recipeCard.template
    })
  }

  private _onRecipesUpdate(keyword: string): void {
    this._updateRecipeCount(this.registry.filteredRecipes.length)
    this.render(keyword)
  }

  private _updateRecipeCount(count: number): void {
    document.querySelector("#recipeCount")!.textContent = count.toString()
  }
}
