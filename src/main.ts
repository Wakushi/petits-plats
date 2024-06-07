import "../styles.css"
import RecipeListComponent from "./components/recipe-list"
import SearchBarComponent from "./components/search-bar"
import { recipes } from "../data/recipes"
import { TagSelectComponent } from "./components/tag-select"
import { RecipeRegistry } from "./recipe-registry"

class App {
  static init() {
    const registry = new RecipeRegistry(recipes)
    new SearchBarComponent()
    new RecipeListComponent(recipes)
    new TagSelectComponent("ingredients", registry.ingredientTags)
    new TagSelectComponent("appliance", registry.applianceTags)
    new TagSelectComponent("ustensils", registry.ustensilTags)
  }
}

App.init()
