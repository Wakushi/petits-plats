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
    this.registry.searchKeyword = searchValue
    
    if (searchValue.length < 3) {
      this.registry.filteredRecipes = this.registry.recipes
      this.registry.filterRecipesByActiveTags(this.registry.activeTags)
      return
    }

    this.registry.filterRecipesByKeyword(searchValue)
    this.registry.filterRecipesByActiveTags(this.registry.activeTags)
  }
}
