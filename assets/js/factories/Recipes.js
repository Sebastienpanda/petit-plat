import { recipes } from "../../../data/recipes.js";
import { Select } from "./Select.js";

export class Recipes {
  #data = [];
  #recipeContainer = null;
  #totalRecipes = null;

  constructor() {
    this.#data = [...recipes];
    console.log("INITIAL DATA = ",this.#data);
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
    console.log("******** hasIngredientMatch ******");
    console.log("SEARCHTERM == ", searchTerm);
    console.log("LIST OF INGREDIENT", ingredients);
    ingredients.map((anIngredient) => {
      console.log("DATA = ", anIngredient);
      const { ingredient  } = anIngredient;
      console.log("INGREDIENT LABEL == ", ingredient);
      console.log("CHECK == ", ingredient.toLowerCase());
      console.log("WITH == ", searchTerm.toLowerCase());
      if (ingredient.toLowerCase() === searchTerm.toLowerCase()) {
        return true;
      }
    })
    return false;
  }

  _hasAppareilMatch(anAppareil, searchTerm) {
    if (anAppareil.toLowerCase().includes(searchTerm)) {
      return true;
    }
    return false;
  }

  _hasUstensilMatch(ustensils, searchTerm) {
    ustensils.map((anUstensil) => {
      if (anUstensil.toLowerCase().includes(searchTerm)) {
        return true;
      }
    })
    return false;
  }

  searchRecipes(searchTerms) {
    const filteredRecipes = [];
    searchTerms = searchTerms.trim().toLowerCase();
    this.#data.map((recipe) => {
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
    })
    return filteredRecipes;
  }

  searchRecipeExt(searchTerms, ingredientTags, appareilTags, ustensilTags) {
    let filteredRecipes = [];

    searchTerms = searchTerms.trim();
    if (searchTerms !== "") {
      console.log('GLOBAL SEARCH = ', searchTerms);
      this.#data.map((recipe) => {
        const { name, description } = recipe;
        const lowerCaseName = name.toLowerCase();
        const lowerCaseDescription = description.toLowerCase();
        if (lowerCaseName.includes(searchTerms) || lowerCaseDescription.includes(searchTerms)) {
          filteredRecipes.push(recipe);
        }
      });
    }

    if (filteredRecipes.length === 0) {
      console.log('GLOBAL SEARCH NO RESULT');
      filteredRecipes = [...this.#data]
    }

    console.log("FILTERED RESULT = ", filteredRecipes)

    if ((ingredientTags !== null) && (ingredientTags.length > 0)) {
      console.log("SEARCH INGREDIENT");
    console.log("TAGS = ", ingredientTags);
      filteredRecipes.map((recipe) => {
        const { ingredients } = recipe;
        console.log("====================================================================================");
        console.log("INGREDIENTS = ", ingredients);
        for ( const tag of ingredientTags) {
          console.log("Search ==> ", tag);
          const hasIngredient = this._hasIngredientMatch(ingredients, tag);
          console.log("hasIngredient = ", hasIngredient);
          if (hasIngredient) {
            console.log("INGEDIENT FOUND : ", tag);
            filteredRecipes.push(recipe);
            break;
          }
          console.log("-----------------------------------------------------------------------------");
        }
        /*ingredientTags.forEach((tag) => {
          console.log("Search ==> ", tag);
          const hasIngredient = this._hasIngredientMatch(ingredients, tag);
          console.log("hasIngredient = ", hasIngredient);
          if (hasIngredient) {
            console.log("INGEDIENT FOUND : ", tag);
            filteredRecipes.push(recipe);
          }*/

        //})
      })
      console.log("==> INGREDIENT FILTERED RESULT <====== ", filteredRecipes)
    }

    if ((appareilTags !== null) && (ingredientTags.length > 0)) {
      console.log("APPAREIL SEARCH");
      filteredRecipes.map((recipe) => {
        const { appliance } = recipe;
        appareilTags.forEach((tag) => {
          const hasAppareil = this._hasAppareilMatch(appliance, tag);
          if (hasAppareil) {
            console.log("APPAREIL FOUND : ", tag);
            filteredRecipes.push(recipe);
          }
        })
      })
      console.log("==> APPAREILS FILTERED RESULT = ", filteredRecipes)
    }


    if ((ustensilTags !== null) && (ustensilTags.length > 0)) {
      console.log("USTENSIL SEARCH");
      filteredRecipes.map((recipe) => {
        const { ustensils } = recipe;
        ustensilTags.forEach((tag) => {
          const hasUstensil = this._hasUstensilMatch(ustensils, tag);
          if (hasustensil) {
            console.log('USTENSIL FOUND', tag);
            filteredRecipes.push(recipe);
          }
        })
      })
      console.log("==> USTENSIL FILTERED RESULT = ", filteredRecipes)
    }
    console.log("=====> FINAL FILTERED RESULT <===== ", filteredRecipes)
    this.displayRecipes(filteredRecipes);
  }

  displayRecipes(recipes) {
    if (!recipes) {
      recipes = this.#data;
    }

    if (this.#totalRecipes) {
      this.#totalRecipes.innerHTML = `${recipes.length} recettes`;
    }

    this.#recipeContainer.innerHTML = "";
    const recipeCards = recipes.map((recipe) => {
      let ingredientInsertHtml = recipe.ingredients
        .map((ingredient) => this._generateHTMLIngredient(ingredient))
        .join("");

      return this._generateHTMLCard(recipe, ingredientInsertHtml);
    });

    this.#recipeContainer.innerHTML += recipeCards.join("");
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
        <p>Aucune recette contient <strong>${searchTerms}</strong>. Vous pouvez chercher "tarte aux pommes", "poisson"</p>
      </div>
      `;
  }

  get data() {
    return this.#data;
  }
}
