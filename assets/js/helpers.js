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
