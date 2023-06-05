import { filterRecipes, getRecipe } from "./helpers.js";
const containerCard = document.querySelector("#containerCard");

const searchValue = document.getElementById("search");
searchValue.addEventListener("input", () => {
  const searchTerm = searchValue.value.trim().toLowerCase();
  if (searchTerm.length >= 3) {
    filterRecipes(searchTerm);
  } else {
    containerCard.innerHTML = "";
    getRecipe();
  }
});
getRecipe();
