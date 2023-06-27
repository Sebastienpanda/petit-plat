import { Recipes } from "../factories/Recipes.js";
import { Select } from "../factories/Select.js";

const recipes = new Recipes();
const select = new Select();

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
  const result = recipes.searchRecipes(searchTerms);
  recipes.displaySearchResult({
    searchTerms: searchTerms,
    result: result,
  });
  select.updateSelectListItems(result);
};

const initialize = () => {
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
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initialize();
  recipes.displayRecipes();
  select;
});
