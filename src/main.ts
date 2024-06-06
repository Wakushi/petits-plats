import "../styles.css"
import RecipeListComponent from "./components/recipe-list"
import SearchBarComponent from "./components/search-bar"
import { recipes } from "../data/recipes"

class App {
  static init() {
    new SearchBarComponent()
    new RecipeListComponent(recipes)
  }
}

App.init()
