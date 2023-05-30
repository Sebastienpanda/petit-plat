import { recipes } from "../../data/recipes.js";
import {
  filterRecipes,
  generateCardHtml,
  generateIngredientHtml,
} from "./helpers.js";
const containerCard = document.querySelector("#containerCard");
const searchValue = document.getElementById("search");
searchValue.addEventListener("input", () => {
  const searchTerm = searchValue.value.trim().toLowerCase();
  if (searchTerm.length >= 3) {
    filterRecipes(searchTerm);
  }
});

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
