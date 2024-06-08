import { Recipe } from "../types/recipe"
import { ActiveTag } from "../types/tag"
import { StateChangeType } from "../types/state"

export class RecipeRegistry {
  private _recipes: Recipe[]
  private _filteredRecipes: Recipe[] = []
  private _activeTags: ActiveTag[] = []

  private _recipesByIngredients: Map<string, Recipe[]> = new Map()
  private _recipesByAppliances: Map<string, Recipe[]> = new Map()
  private _recipesByUstensils: Map<string, Recipe[]> = new Map()

  public ingredientTags: string[] = []
  public applianceTags: string[] = []
  public ustensilTags: string[] = []

  public searchKeyword: string = ""

  constructor(recipes: Recipe[]) {
    this._recipes = this._getOptimizedRecipes(recipes)
    this._filteredRecipes = this._recipes
    this._setTagsFromRecipes(this.filteredRecipes)
  }

  get recipes(): Recipe[] {
    return this._recipes
  }

  get filteredRecipes(): Recipe[] {
    return this._filteredRecipes
  }

  set filteredRecipes(filteredRecipes: Recipe[]) {
    this._filteredRecipes = filteredRecipes
    this._setTagsFromRecipes(filteredRecipes)
    this._emitStateChange([StateChangeType.RECIPES, StateChangeType.TAGS])
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
      this._emitStateChange([StateChangeType.TAGS_REMOVE])
    } else {
      this._emitStateChange([StateChangeType.TAGS])
    }
  }

  // Make branch with alt implementation
  public filterRecipesByKeyword(keyword: string): void {
    const formattedKeyword = keyword.toLowerCase().replace(/\s+/g, "")
    const filteredRecipes: Recipe[] = []
    for (const recipe of this.recipes) {
      const { name, description, ingredientsText } = recipe
      if (name.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
        continue
      }
      if (description.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
        continue
      }
      if (ingredientsText!.toLowerCase().includes(formattedKeyword)) {
        filteredRecipes.push(recipe)
      }
    }
    this.filteredRecipes = filteredRecipes
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

  private _setTagsFromRecipes(recipes: Recipe[]) {
    this._recipesByIngredients = new Map()
    this._recipesByAppliances = new Map()
    this._recipesByUstensils = new Map()

    for (const recipe of recipes) {
      const { ingredients, appliance, ustensils } = recipe

      for (const { ingredient } of ingredients) {
        const formattedIngredient = ingredient.toLowerCase()
        if (!this._recipesByIngredients.has(formattedIngredient)) {
          this._recipesByIngredients.set(formattedIngredient, [recipe])
        } else {
          const recipes = this._recipesByIngredients.get(formattedIngredient)
          if (recipes) {
            recipes.push(recipe)
            this._recipesByIngredients.set(formattedIngredient, recipes)
          }
        }
      }

      const formattedAppliance = appliance.toLowerCase()
      if (!this._recipesByAppliances.has(formattedAppliance)) {
        this._recipesByAppliances.set(formattedAppliance, [recipe])
      } else {
        const recipes = this._recipesByAppliances.get(formattedAppliance)
        if (recipes) {
          recipes.push(recipe)
          this._recipesByAppliances.set(formattedAppliance, recipes)
        }
      }

      for (const ustensil of ustensils) {
        const formattedUstensil = ustensil.toLowerCase()
        if (!this._recipesByUstensils.has(formattedUstensil)) {
          this._recipesByUstensils.set(formattedUstensil, [recipe])
        } else {
          const recipes = this._recipesByUstensils.get(formattedUstensil)
          if (recipes) {
            recipes.push(recipe)
            this._recipesByUstensils.set(formattedUstensil, recipes)
          }
        }
      }
    }

    this.ingredientTags = Array.from(this._recipesByIngredients.keys()).filter(
      (ingredient) => {
        return !this.activeTags.some((tag) => tag.label === ingredient)
      }
    )
    this.applianceTags = Array.from(this._recipesByAppliances.keys()).filter(
      (appliance) => {
        return !this.activeTags.some((tag) => tag.label === appliance)
      }
    )
    this.ustensilTags = Array.from(this._recipesByUstensils.keys()).filter(
      (ustensil) => {
        return !this.activeTags.some((tag) => tag.label === ustensil)
      }
    )
  }

  private _emitStateChange(state: StateChangeType[]): void {
    document.dispatchEvent(new CustomEvent("stateChange", { detail: state }))
  }
}
