import { recipes } from "../../data/recipes"
import { Recipe } from "../../types/recipe"

export default class SearchBarComponent {
  searchBarElement: HTMLInputElement
  constructor() {
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
      this.emitFilterEvent(recipes)
      return
    }

    const filteredRecipes = this.getFilteredRecipesA(searchValue)
    this.emitFilterEvent(filteredRecipes)
  }

  getFilteredRecipesA(keyword: string): Recipe[] {
    const formattedKeyword = keyword.toLowerCase().replace(/\s+/g, "")
    const filteredRecipes: Recipe[] = []
    for (const recipe of recipes) {
      const { name, description, ingredients } = recipe
      if (name.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
        continue
      }
      if (description.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
        continue
      }
      if (
        ingredients.some(({ ingredient }) =>
          ingredient.toLowerCase().includes(formattedKeyword)
        )
      ) {
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
