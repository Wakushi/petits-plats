import { Recipe } from "../types/recipe"
import { ActiveTag } from "../types/tag"

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
    this._emitStateChange()
  }

  get activeTags(): ActiveTag[] {
    return this._activeTags
  }

  set activeTags(tags: ActiveTag[]) {
    this._filterRecipesByTags(tags)
    this._activeTags = tags
    this._emitStateChange()
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

  public onTagRemoved(): void {
    this.filterRecipesByKeyword(this.searchKeyword)
    this._filterRecipesByTags(this.activeTags)
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

    this.ingredientTags = Array.from(this._recipesByIngredients.keys())
    this.applianceTags = Array.from(this._recipesByAppliances.keys())
    this.ustensilTags = Array.from(this._recipesByUstensils.keys())
  }

  private _filterRecipesByTags(tags: ActiveTag[]): void {
    if (!tags.length) return
    const filteredRecipes: Recipe[] = []
    for (const recipe of this.filteredRecipes) {
      let shouldAdd = false
      for (const tag of tags) {
        switch (tag.type) {
          case "ingredients":
            if (recipe.ingredientsText!.includes(tag.label.toLowerCase())) {
              shouldAdd = true
            }
            break
          case "appliance":
            if (
              recipe.appliance.toLowerCase().includes(tag.label.toLowerCase())
            ) {
              shouldAdd = true
            }
            break
          case "ustensils":
            if (
              recipe.ustensils
                .map((ustensil) => ustensil.toLowerCase())
                .includes(tag.label.toLowerCase())
            ) {
              shouldAdd = true
            }
            break
        }
      }
      if (shouldAdd) {
        filteredRecipes.push(recipe)
      }
    }
    this.filteredRecipes = filteredRecipes
  }

  private _emitStateChange(): void {
    document.dispatchEvent(new CustomEvent("stateChange"))
  }
}
