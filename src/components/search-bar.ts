import { Recipe } from "../../types/recipe"
import { RecipeRegistry } from "../recipe-registry"

export default class SearchBarComponent {
  registry: RecipeRegistry
  searchBarElement: HTMLInputElement

  constructor(registry: RecipeRegistry) {
    this.registry = registry
    this.searchBarElement = document.querySelector(
      "#searchBar"
    ) as HTMLInputElement
    this._bindSearchBar()
  }

  private _bindSearchBar() {
    this.searchBarElement.addEventListener("keyup", () =>
      this._onSearchChange()
    )
  }

  private _onSearchChange() {
    const searchValue = this.searchBarElement.value
    if (searchValue.length === 2) {
      this.registry.filteredRecipes = this.registry.recipes
      this._emitFilterEvent()
      return
    }

    this.registry.filteredRecipes =
      this._getFilteredRecipesByKeyword(searchValue)
    this._emitFilterEvent()
  }

  // TODO - Make a branch with B algorithm
  private _getFilteredRecipesByKeyword(keyword: string): Recipe[] {
    const formattedKeyword = keyword.toLowerCase().replace(/\s+/g, "")
    const filteredRecipes: Recipe[] = []
    for (const recipe of this.registry.recipes) {
      const { name, description, ingredientsText } = recipe
      if (name.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
        continue
      }
      if (description.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
        continue
      }
      if (ingredientsText!.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
      }
    }
    return filteredRecipes
  }

  private _emitFilterEvent(): void {
    const event = new CustomEvent("filter", {
      detail: {
        keyword: this.searchBarElement.value,
      },
    })

    document.dispatchEvent(event)
  }
}
