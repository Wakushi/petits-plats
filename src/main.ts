import "../styles.css"
import RecipeListComponent from "./components/recipe-list"
import SearchBarComponent from "./components/search-bar"
import { recipes } from "../data/recipes"
import { TagSelectComponent } from "./components/tag-select"

class App {
  static init() {
    new SearchBarComponent()
    new RecipeListComponent(recipes)
    new TagSelectComponent("ingredients")
  }
}

App.init()
