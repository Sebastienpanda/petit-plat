import { recipes } from "../../data/recipes.js";
import { generateCardHtml, generateIngredientHtml } from "./helpers.js";
const containerCard = document.querySelector("#containerCard");

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
