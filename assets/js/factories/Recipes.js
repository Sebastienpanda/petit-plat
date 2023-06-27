import { recipes } from "../../../data/recipes.js";
import { Select } from "./Select.js";

export class Recipes {
  #data = [];
  #recipeContainer = null;
  #totalRecipes = null;

  constructor() {
    this.#data = [...recipes];
    this.#recipeContainer = document.querySelector("#recipes");
    this.#totalRecipes = document.querySelector("#totalRecipes");
  }

  _generateHTMLCard(recipe, ingredientInsertHtml) {
    return `
      <article class="recipe">
          <img src=../assets/images/${recipe.image} alt=${recipe.name} loading="lazy" />
          <h2 class="recipe-h2">${recipe.name}</h2>
          <section class="recipe-header">
            <span class="recipe-small-title">recette</span>
            <p class="recipe-content">
              ${recipe.description}
            </p>
          </section>
          <section class="recipe-ingredient">
            <span class="recipe-small-title">Ingrédients</span>
            <ul class="recipe-container-ingredient">
            ${ingredientInsertHtml}
            </ul>
          </section>
        </article>
      `;
  }

  _generateHTMLIngredient(ingredient) {
    if (ingredient.unit === "" || ingredient.unit === undefined) {
      if (ingredient.quantity) {
        return `
        <li>
          <span class="recipe-title">${ingredient.ingredient}</span>
          <span class="recipe-subtitle">${ingredient.quantity}</span>
        </li>
        `;
      } else {
        return `
        <li>
          <span class="recipe-title">${ingredient.ingredient}</span>
          <span class="recipe-subtitle">-</span>
        </li>
        `;
      }
    } else {
      return `
        <li>
          <span class="recipe-title">${ingredient.ingredient}</span>
          <span class="recipe-subtitle">${ingredient.quantity} ${ingredient.unit}</span>
        </li>
        `;
    }
  }

  _hasIngredientMatch(ingredients, searchTerm) {
    for (const ingredient of ingredients) {
      const { ingredient: ingredientName } = ingredient;
      if (ingredientName.toLowerCase().includes(searchTerm)) {
        return true;
      }
    }
    return false;
  }

  searchRecipes(searchTerms) {
    const filteredRecipes = [];
    searchTerms = searchTerms.trim().toLowerCase();
    for (const recipe of this.#data) {
      const { name, description, ingredients } = recipe;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();
      const hasIngredient = this._hasIngredientMatch(ingredients, searchTerms);
      if (
        lowerCaseName.includes(searchTerms) ||
        lowerCaseDescription.includes(searchTerms) ||
        hasIngredient
      ) {
        filteredRecipes.push(recipe);
      }
    }
    return filteredRecipes;
  }

  displayRecipes(recipes) {
    if (!recipes) {
      recipes = this.#data;
    }

    if (this.#totalRecipes) {
      this.#totalRecipes.innerHTML = `${recipes.length} recettes`;
    }

    this.#recipeContainer.innerHTML = "";
    for (const recipe of recipes) {
      let ingredientInsertHtml = "";
      for (const ingredient of recipe.ingredients) {
        ingredientInsertHtml += this._generateHTMLIngredient(ingredient);
      }
      this.#recipeContainer.innerHTML += this._generateHTMLCard(
        recipe,
        ingredientInsertHtml
      );
    }
  }

  displaySearchResult({ searchTerms, result }) {
    if (this.#totalRecipes) {
      this.#totalRecipes.innerHTML = `${result.length} recettes`;
    }

    if (result.length > 0) {
      this.displayRecipes(result);
      return;
    }

    this.#recipeContainer.innerHTML = "";
    this.#recipeContainer.innerHTML = `
      <div class="notFound">
        <p>Aucune recette ne contient <strong>${searchTerms}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
      </div>
      `;
  }
}
