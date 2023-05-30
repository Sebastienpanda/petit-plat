import { recipes } from "../../data/recipes.js";
const containerCard = document.querySelector("#containerCard");

export function generateCardHtml(recipe, ingredientsHtml) {
  const { name, description, image, title } = recipe;

  return `
    <img class="cardImg w-100" src="../assets/images/${image}" alt="${title}" lazy="loading"/>
    <div class="paddingElement">
      <h2>${name}</h2>
      <span class="d-block pb-3 recipe">RECETTE</span>
      <p>${description}</p>
      <span class="d-block pb-3 recipe">INGREDIENTS</span>
      <div class="containerIngredients">${ingredientsHtml}</div>
    </div>
  `;
}

export function generateRecipeCardHtml(recipe) {
  const { name, description, image, title } = recipe;

  return `
  <div class="cardElement">
    <img class="cardImg w-100" src="../assets/images/${image}" alt="${title}" lazy="loading"/>
    <div class="paddingElement">
      <h2>${name}</h2>
      <span class="d-block pb-3 recipe">RECETTE</span>
      <p>${description}</p>
      <span class="d-block pb-3 recipe">INGREDIENTS</span>
    </div>
  </div>
  `;
}

export function generateIngredientHtml(ingredient) {
  if (ingredient.unit === "" || ingredient.unit === undefined) {
    if (ingredient.quantity) {
      return /* HTML */ `
        <div class="containerIngredient">
          <p class="ingredient">${ingredient.ingredient}</p>
          <p class="bars">${ingredient.quantity}</p>
        </div>
      `;
    } else {
      return /* HTML */ `
        <div class="containerIngredient">
          <p class="ingredient">${ingredient.ingredient}</p>
          <p class="bars">-</p>
        </div>
      `;
    }
  } else {
    return /* HTML */ `
      <div class="containerIngredient">
        <p class="ingredient">${ingredient.ingredient}</p>
        <p class="bars">${ingredient.quantity} ${ingredient.unit}</p>
      </div>
    `;
  }
}

export function filterRecipes(searchTerm) {
  const filteredRecipes = [];
  for (const recipe of recipes) {
    const { name, ingredients } = recipe;
    const lowerCaseName = name.toLowerCase();
    if (
      lowerCaseName.includes(searchTerm) ||
      hasIngredientMatch(ingredients, searchTerm)
    ) {
      filteredRecipes.push(recipe);
    }
  }
  displayRecipes(filteredRecipes);
}

export function hasIngredientMatch(ingredients, searchTerm) {
  for (const ingredient of ingredients) {
    const { ingredient: ingredientName } = ingredient;
    if (ingredientName.toLowerCase().includes(searchTerm)) {
      return true;
    }
  }
  return false;
}
export function displayRecipes(recipeData) {
  let recipesHtml = "";
  containerCard.innerHTML = "";

  if (recipeData.length === 0) {
    containerCard.innerHTML = `<p>Aucune recette trouvée</p>`;
    return;
  }

  for (const recipe of recipeData) {
    const recipeHtml = generateRecipeCardHtml(recipe);
    recipesHtml += recipeHtml;
  }
  containerCard.innerHTML = recipesHtml;
}
