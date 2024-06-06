import { recipes } from "../../data/recipes"

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
      return
    }

    // Search in :
    // - Title
    // - Description
    // - Ingredients
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

    console.log("Filtered: ", filteredRecipes)
  }
}
