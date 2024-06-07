import "../styles.css"
import { recipes } from "../data/recipes"
import RecipeListComponent from "./components/recipe-list"
import SearchBarComponent from "./components/search-bar"
import { TagSelectComponent } from "./components/tag-select"
import { RecipeRegistry } from "./recipe-registry"
import { ActiveTagsListComponent } from "./components/active-tag-list"

class App {
  static init() {
    const registry = new RecipeRegistry(recipes)
    new SearchBarComponent(registry)
    new RecipeListComponent(registry)
    new TagSelectComponent("ingredients", registry)
    new TagSelectComponent("appliance", registry)
    new TagSelectComponent("ustensils", registry)
    new ActiveTagsListComponent(registry)
  }
}

App.init()
