import { Recipes } from "../factories/Recipes.js";
import { Select } from "../factories/Select.js";

const recipes = new Recipes();

let selectIngredients, selectAppareils, selectUstensiles;
let searchResult = [...recipes.data];
let searchTerms = '';
//===========================================================


const removeDuplicateObjects = (array, property) => {
  const uniqueIds = [];

  const unique = array.filter(element => {
    const isDuplicate = uniqueIds.includes(element[property]);

    if (!isDuplicate) {
      uniqueIds.push(element[property]);

      return true;
    }

    return false;
  });

  return unique;
}

const loadIngredients = (fromRecipes) => {
  const ingredients = [];
  for (const recipe of fromRecipes) {
    for (const ingredient of recipe.ingredients) {
      ingredients.push({
        name: ingredient.ingredient,
        isSelected: false
      });
    }
  }
  return removeDuplicateObjects(ingredients, "name");
};

const loadAppareils = (fromRecipes) => {
  const appareils = [];
  for (const recipe of fromRecipes) {
    appareils.push({
      name: recipe.appliance,
      isSelected: false
    });
  }
  return removeDuplicateObjects(appareils, "name");
};

const loadUstensils = (fromRecipes) => {

  const ustensils = [];
  for (const recipe of fromRecipes) {
    for (const ustensil of recipe.ustensils) {
      ustensils.push({
        name: ustensil,
        isSelected: false
      });
    }
  }
  return removeDuplicateObjects(ustensils, "name");
};


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
    result: searchResult
  });

  selectIngredients.updateListItem(loadIngredients(searchResult));
  selectAppareils.updateListItem(loadAppareils(searchResult));
  selectUstensiles.updateListItem(loadUstensils(searchResult));
};

const handleSelectIngredientOnSearchEvent = (searchTerms) => {

  const filteredResults = searchResult.filter((element) => {

    const toto = element.ingredients.filter((ingredient) => {

      return ingredient.ingredient === searchTerms;
    });

    return toto.length > 0;
  });

  searchResult = [...filteredResults];

  selectAppareils.updateListItem(loadAppareils(filteredResults));
  selectUstensiles.updateListItem(loadUstensils(filteredResults));

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });
};

const handleSelectApplianceOnSearchEvent = (searchTerms) => {

  console.log("RECIPES ==> ", searchResult);
  const filteredResults = searchResult.filter((element) => {
    console.log("SELECT APAREIL ==> ", searchTerms);
    console.log("CHECK WITH = ", element.appliance);
    console.log("IS FOUND = ", element.appliance === searchTerms);
    return element.appliance === searchTerms;
  });
  console.log("SELECT RESULT ==> ", filteredResults);

  searchResult = [...filteredResults];

  selectIngredients.updateListItem(loadIngredients(filteredResults));
  selectUstensiles.updateListItem(loadUstensils(filteredResults));

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });
};

const handleSelectUstensilsOnSearchEvent = (searchTerms) => {
  const filteredResults = searchResult.filter((element) => {

    const toto = element.ustensils.filter((ustensils) => {
      return ustensils === searchTerms;
    });

    return toto.length > 0;
  });

  searchResult = [...filteredResults];

  selectIngredients.updateListItem(loadIngredients(filteredResults));
  selectAppareils.updateListItem(loadAppareils(filteredResults));

  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: filteredResults
  });
};

const handleSelectOnResetEvent = () => {
  recipes.searchRecipeExt(searchTerms, selectIngredients.selectedItems, selectAppareils.selectedItems, selectUstensiles.selectedItems )
}

const initializeEvents = () => {
  const searchValue = document.getElementById("search");

  searchValue.addEventListener("input", () => {
    searchTerms = searchValue.value;
    const callSearch = debounce(() => {
      searchRecipes(searchTerms);
    }, 300);
    if (searchTerms.length >= 3) {
      callSearch();
    } else {
      recipes.displayRecipes();
      selectIngredients.reset();
      selectAppareils.reset();
      selectUstensiles.reset();
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
    deleteTagEventCallBack: (tags) => {
      recipes.searchRecipeExt(searchTerms, tags, selectAppareils.selectedItems, selectUstensiles.selectedItems )
    },
    resetEventCallBack: handleSelectOnResetEvent
  });
  selectAppareils = new Select({
    selectElement: "#selectAppareils",
    defaultSelectLabel: "Appareils",
    initialListItem: loadAppareils(recipes.data),
    searchEventCallback: handleSelectApplianceOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      recipes.searchRecipeExt(searchTerms, selectIngredients.selectedItems, tags, selectUstensiles.selectedItems )
    },
    resetEventCallBack: handleSelectOnResetEvent
  });
  selectUstensiles = new Select({
    selectElement: "#selectUstensiles",
    defaultSelectLabel: "Ustensils",
    initialListItem: loadUstensils(recipes.data),
    searchEventCallback: handleSelectUstensilsOnSearchEvent,
    deleteTagEventCallBack: (tags) => {
      recipes.searchRecipeExt(searchTerms, selectIngredients.selectedItems, selectAppareils.selectedItems, tags )
    },
    resetEventCallBack: handleSelectOnResetEvent
  });

  recipes.displayRecipes();
});
