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
    this.searchBarElement.addEventListener("keyup", this.handleSearch)
  }

  handleSearch = () => {
    const searchValue = this.searchBarElement.value
    if (searchValue.length < 3) {
      this.emitFilterEvent(recipes)
      return
    }

    const filteredRecipes = recipes.filter((recipe) => {
      const matchTitle = recipe.name
        .toLowerCase()
        .includes(searchValue.toLowerCase())
      const matchDesc = recipe.description
        .toLowerCase()
        .includes(searchValue.toLowerCase())
      const matchIngredients = recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchValue.toLowerCase())
      )
      return matchTitle || matchDesc || matchIngredients
    })

    this.emitFilterEvent(filteredRecipes)
  }

  emitFilterEvent(recipes: Recipe[]): void {
    const event = new CustomEvent("filter", {
      detail: recipes,
    })

    document.dispatchEvent(event)
  }
}
