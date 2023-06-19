import { recipes } from "../../data/recipes.js";
const containerCard = document.querySelector("#containerCard");
const totalRecipes = document.querySelector("#totalRecipes");

const selectAppareil = document.querySelector("#appareils");
const selectUstensils = document.querySelector("#ustensils");

export function generateCardHtml(recipe, ingredientsHtml) {
  const { name, description, image, title, time } = recipe;

  return `
  <div class="time">
  <span>${time}min</span>
  </div>
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
    const { name, description, ingredients } = recipe;
    const lowerCaseName = name.toLowerCase();
    const lowerCaseDescription = description.toLocaleLowerCase();
    if (
      lowerCaseName.includes(searchTerm) ||
      lowerCaseDescription.includes(searchTerm) ||
      hasIngredientMatch(ingredients, searchTerm)
    ) {
      filteredRecipes.push(recipe);
    }
  }
  displayRecipes(filteredRecipes, searchTerm);
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

export function displayRecipes(recipeData, searchTerm) {
  totalRecipes.innerHTML = `${recipeData.length} recettes`;
  let recipesHtml = "";
  containerCard.innerHTML = "";
  if (recipeData.length === 0) {
    containerCard.innerHTML = `
    <div class="notFound">
      <p>Aucune recette ne contient <strong>${searchTerm}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
    </div>
    `;
    return;
  }
  for (const recipe of recipeData) {
    const card = document.createElement("div");
    card.className = "cardElement";
    for (const ingredient of recipe.ingredients) {
      const recipeHtml = generateIngredientHtml(ingredient);
      recipesHtml += recipeHtml;
    }
    const cardHtml = generateCardHtml(recipe, recipesHtml);
    card.innerHTML = cardHtml;
    containerCard.append(card);
  }
}
export function getRecipe() {
  totalRecipes.innerHTML = `${recipes.length} recettes`;
  for (const recipe of recipes) {
    const card = document.createElement("div");
    card.className = "cardElement";
    let ingredientsHtml = "";
    for (const ingredient of recipe.ingredients) {
      const ingredientHtml = generateIngredientHtml(ingredient);
      ingredientsHtml += ingredientHtml;
    }
    const cardHtml = generateCardHtml(recipe, ingredientsHtml);
    card.innerHTML = cardHtml;
    containerCard.append(card);
  }
}
