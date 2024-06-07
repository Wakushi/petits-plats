// getFilteredRecipesA (264738) 🏆
function getFilteredRecipesA(keyword) { 
  const formattedKeyword = keyword.toLowerCase()
  const filteredRecipes = []
  for (const recipe of recipes) {
    const { name, description, ingredients } = recipe
    if (name.toLowerCase().includes(formattedKeyword)) {
      filteredRecipes.push(recipe)
      continue
    }
    if (description.toLowerCase().includes(formattedKeyword)) {
      filteredRecipes.push(recipe)
      continue
    }
    if (
      ingredients.some(({ ingredient }) =>
        ingredient.toLowerCase().includes(formattedKeyword)
      )
    ) {
      filteredRecipes.push(recipe)
    }
  }
  return filteredRecipes
}

const resultA = getFilteredRecipesA("poisson")

// getFilteredRecipesB (262622)
function getFilteredRecipesB(keyword) {
  const formattedKeyword = keyword.toLowerCase()
  return recipes.filter((recipe) => {
    const { name, description, ingredients } = recipe
    if (name.toLowerCase().includes(formattedKeyword)) {
      return true
    }
    if (description.toLowerCase().includes(formattedKeyword)) {
      return true
    }
    if (
      ingredients.some(({ ingredient }) =>
        ingredient.toLowerCase().includes(formattedKeyword)
      )
    ) {
      return true
    }
    return false
  })
}

const resultB = getFilteredRecipesB("poisson")
