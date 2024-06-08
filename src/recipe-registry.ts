import { Recipe } from "../types/recipe"
import { ActiveTag } from "../types/tag"
import { StateChangeType } from "../types/state"

export class RecipeRegistry {
  private _recipes: Recipe[]
  private _filteredRecipes: Recipe[] = []
  private _activeTags: ActiveTag[] = []

  public ingredientTags: string[] = []
  public applianceTags: string[] = []
  public ustensilTags: string[] = []

  public searchKeyword: string = ""

  constructor(recipes: Recipe[]) {
    this._recipes = this._getOptimizedRecipes(recipes)
    this._filteredRecipes = this._recipes
    this._buildTagsFromRecipes(this.filteredRecipes)
  }

  get recipes(): Recipe[] {
    return this._recipes
  }

  get filteredRecipes(): Recipe[] {
    return this._filteredRecipes
  }

  set filteredRecipes(filteredRecipes: Recipe[]) {
    this._filteredRecipes = filteredRecipes
    this._buildTagsFromRecipes(filteredRecipes)
    this._onStateChange([StateChangeType.RECIPES, StateChangeType.TAGS])
  }

  get activeTags(): ActiveTag[] {
    return this._activeTags
  }

  set activeTags(tags: ActiveTag[]) {
    const prevLength = this._activeTags.length
    const newLength = tags.length
    this.filterRecipesByActiveTags(tags)
    this._activeTags = tags
    if (prevLength > newLength) {
      this._onStateChange([StateChangeType.TAGS_REMOVE])
    } else {
      this._onStateChange([StateChangeType.TAGS])
    }
  }

  // Make branch with alt implementation
  public filterRecipesByKeyword(keyword: string): void {
    const formattedKeyword = keyword.toLowerCase().replace(/\s+/g, "")
    this.filteredRecipes = this.recipes.filter((recipe) => {
      const { name, description, ingredientsText } = recipe
      if (name.toLowerCase().includes(formattedKeyword)) {
        return true
      }
      if (description.toLowerCase().includes(formattedKeyword)) {
        return true
      }
      if (ingredientsText!.toLowerCase().includes(formattedKeyword)) {
        return true
      }
      return false
    })
  }

  public filterRecipesByActiveTags(tags: ActiveTag[]): void {
    if (!tags.length) {
      this.filteredRecipes = this.filteredRecipes
      return
    }
    const filteredRecipes: Recipe[] = []
    for (const recipe of this.filteredRecipes) {
      const discrepancies = []
      for (const tag of tags) {
        switch (tag.type) {
          case "ingredients":
            if (!recipe.ingredientsText!.includes(tag.label.toLowerCase())) {
              discrepancies.push(tag)
            }
            break
          case "appliance":
            if (
              !recipe.appliance.toLowerCase().includes(tag.label.toLowerCase())
            ) {
              discrepancies.push(tag)
            }
            break
          case "ustensils":
            if (
              !recipe.ustensils
                .map((ustensil) => ustensil.toLowerCase())
                .includes(tag.label.toLowerCase())
            ) {
              discrepancies.push(tag)
            }
            break
        }
      }
      if (!discrepancies.length) {
        filteredRecipes.push(recipe)
      }
    }
    this.filteredRecipes = filteredRecipes
  }

  public onTagRemoved(): void {
    this.filterRecipesByKeyword(this.searchKeyword)
    this.filterRecipesByActiveTags(this.activeTags)
  }

  private _getOptimizedRecipes(recipe: Recipe[]): Recipe[] {
    const optimizedRecipes = recipe.map((recipe) => {
      const { ingredients } = recipe
      const stringifiedfIngredients = ingredients
        .map(({ ingredient }) => ingredient.toLowerCase())
        .join(" ")
      return { ...recipe, ingredientsText: stringifiedfIngredients }
    })
    return optimizedRecipes
  }

  private _buildTagsFromRecipes(recipes: Recipe[]) {
    const ingredientSet = new Set<string>()
    const applianceSet = new Set<string>()
    const ustensilSet = new Set<string>()

    for (const recipe of recipes) {
      const { ingredients, appliance, ustensils } = recipe

      for (const { ingredient } of ingredients) {
        const formattedIngredient = ingredient.toLowerCase()
        if (!ingredientSet.has(formattedIngredient)) {
          ingredientSet.add(formattedIngredient)
        }
      }

      const formattedAppliance = appliance.toLowerCase()
      if (!applianceSet.has(formattedAppliance)) {
        applianceSet.add(formattedAppliance)
      }

      for (const ustensil of ustensils) {
        const formattedUstensil = ustensil.toLowerCase()
        if (!ustensilSet.has(formattedUstensil)) {
          ustensilSet.add(formattedUstensil)
        }
      }
    }

    this.ingredientTags = Array.from(ingredientSet.keys()).filter(
      (ingredient) => {
        return !this.activeTags.some((tag) => tag.label === ingredient)
      }
    )
    this.applianceTags = Array.from(applianceSet.keys()).filter((appliance) => {
      return !this.activeTags.some((tag) => tag.label === appliance)
    })
    this.ustensilTags = Array.from(ustensilSet.keys()).filter((ustensil) => {
      return !this.activeTags.some((tag) => tag.label === ustensil)
    })
  }

  private _onStateChange(state: StateChangeType[]): void {
    document.dispatchEvent(new CustomEvent("stateChange", { detail: state }))
  }
}
