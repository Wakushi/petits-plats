import "../styles.css"
import RecipeListComponent from "./components/recipe-list"
import SearchBarComponent from "./components/search-bar"
import { TagSelectComponent } from "./components/tag-select"
import { ActiveTagsListComponent } from "./components/active-tag-list"

class App {
  static init() {
    new SearchBarComponent()
    new RecipeListComponent()
    new TagSelectComponent("ingredients")
    new TagSelectComponent("appliance")
    new TagSelectComponent("ustensils")
    new ActiveTagsListComponent()
  }
}

App.init()
