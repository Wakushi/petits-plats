export default class SearchBar {
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
    console.log(searchValue)
  }
}
