import "../styles.css"
import RecipeListComponent from "./components/recipe-list"
import SearchBarComponent from "./components/search-bar"
import { recipes } from "../data/recipes"
import { TagSelectComponent } from "./components/tag-select"
import { RecipeRegistry } from "./recipe-registry"
import { ActiveTagsListComponent } from "./components/active-tag-list"

class App {
  static init() {
    const registry = new RecipeRegistry(recipes)
    new SearchBarComponent()
    new RecipeListComponent(recipes)
    new TagSelectComponent("ingredients", registry.ingredientTags)
    new TagSelectComponent("appliance", registry.applianceTags)
    new TagSelectComponent("ustensils", registry.ustensilTags)
    new ActiveTagsListComponent()
  }
}

App.init()
