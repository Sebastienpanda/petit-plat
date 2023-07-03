import { Recipes } from "../factories/Recipes.js";
import { Select } from "../factories/Select.js";

const recipes = new Recipes();

let selectIngredients, selectAppareils;
let searchResult = [...recipes.data];
//===========================================================

const loadIngredients = (fromRecipes) => {
  const ingredients = [];
  for (const recipe of fromRecipes) {
    for (const ingredient of recipe.ingredients) {
      ingredients.push({
        name: ingredient.ingredient,
        isSelected: false,
      });
    }
  }
  return ingredients;
};

const loadAppareils = (fromRecipes) => {
  const appareils = [];
  for (const recipe of fromRecipes) {
    appareils.push({
      name: recipe.appliance,
      isSelected: false,
    });
  }
  return appareils;
};

const loadUstensiles = (fromRecipes) => {
  const ustensiles = [];
  for (const recipe of fromRecipes) {
    const current = {
      name: "",
      isSelected: false,
    };

    ustensiles.push({
      name: current.name,
      isSelected: current.isSelected,
    });
  }
  return ustensiles;
};
//===========================================================

const debounce = (callback, timeout = 200) => {
  let debounceTimeoutId = null;

  return (...args) => {
    window.clearTimeout(debounceTimeoutId);
    debounceTimeoutId = window.setTimeout(() => {
      debounceTimeoutId = null;
      callback.apply(null, args);
    }, timeout);
  };
};

const searchRecipes = (searchTerms) => {
  searchResult = recipes.searchRecipes(searchTerms);
  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: result,
  });

  selectIngredients.updateListItem(loadIngredients(result));
  selectAppareils.updateListItem(loadAppareils(result));
  //selectUstensiles.updateListItem(loadUstensiles(result));
};

/*const searchWithSelect = (selectComponent) => {
  //const newSearchResult = searchResult.filter()
};*/

const handleSelectIngredientOnSearchEvent = (searchTerms) => {
  //newSearchResult = searchResult.filter

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: newSearchResult,
  });
};

const initializeEvents = () => {
  const searchValue = document.getElementById("search");

  searchValue.addEventListener("input", () => {
    const searchTerms = searchValue.value;
    const callSearch = debounce(() => {
      searchRecipes(searchTerms);
    }, 300);
    if (searchTerms.length >= 3) {
      callSearch();
    } else {
      recipes.displayRecipes();
      selectIngredients.reset();
      selectAppareils.reset();
      searchResult = [...recipes.data];
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initializeEvents();

  selectIngredients = new Select({
    selectElement: "#selectIngredients",
    defaultSelectLabel: "Ingrédients",
    initialListItem: loadIngredients(recipes.data),
    searchEventCallback: handleSelectIngredientOnSearchEvent,
  });
  selectAppareils = new Select({
    selectElement: "#selectAppareils",
    defaultSelectLabel: "Appareils",
    initialListItem: loadAppareils(recipes.data),
    searchEventCallback: null,
  });
  /*
  const selectUstensiles = new Select({
    selectElement: "#selectUstensiles",
    initialListItem: loadIngredients(recipes),
    searchEventCallback: null
  });
*/

  recipes.displayRecipes();
});
