import { Recipe } from "../../types/recipe"

export default class SearchBarComponent {
  recipes: Recipe[]
  searchBarElement: HTMLInputElement

  constructor(recipes: Recipe[]) {
    this.recipes = recipes
    this.searchBarElement = document.querySelector(
      "#searchBar"
    ) as HTMLInputElement
    this.bindSearchBar()
  }

  bindSearchBar() {
    this.searchBarElement.addEventListener("keyup", () => this.handleSearch())
  }

  handleSearch() {
    const searchValue = this.searchBarElement.value
    if (searchValue.length < 3) {
      this.emitFilterEvent(this.recipes)
      return
    }

    const filteredRecipes = this.getFilteredRecipes(searchValue) // Make a branch with B algorithm
    this.emitFilterEvent(filteredRecipes)
  }

  getFilteredRecipes(keyword: string): Recipe[] {
    const formattedKeyword = keyword.toLowerCase().replace(/\s+/g, "")
    const filteredRecipes: Recipe[] = []
    for (const recipe of this.recipes) {
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

  emitFilterEvent(recipes: Recipe[]): void {
    const event = new CustomEvent("filter", {
      detail: {
        keyword: this.searchBarElement.value,
        recipes,
      },
    })

    document.dispatchEvent(event)
  }
}
