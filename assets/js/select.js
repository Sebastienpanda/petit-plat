import { recipes } from "../../data/recipes.js";
const wrapperIngredient = document.querySelector(".wrapperIngredient");
const selectBtn = wrapperIngredient.querySelector(".select-btn");
const options = wrapperIngredient.querySelector(".options");
const searchInput = wrapperIngredient.querySelector("input");
const tagsIngredient = document.querySelector(".tags");

const wrapperAppliance = document.querySelector(".wrapperAppliance");
const selectBtnAppliance = wrapperAppliance.querySelector(".select-btn");
const optionsAppliance = wrapperAppliance.querySelector(".options");
const searchInputAppliance = wrapperAppliance.querySelector("input");

function addIngredient(selectIngredient) {
  options.innerHTML = "";
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      let isSelected =
        ingredient.ingredient === selectIngredient ? "select" : "";
      let li = document.createElement("li");
      li.textContent = ingredient.ingredient;
      li.className = isSelected;
      li.addEventListener("click", () => {
        updateIngredient(li);
        addTag(li.textContent);
      });
      options.appendChild(li);
    }
  }
}

function updateIngredient(selectedLi) {
  searchInput.value = "";
  addIngredient(selectedLi.innerText);
  wrapperIngredient.classList.remove("active");
  selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

searchInput.addEventListener("keyup", () => {
  let searchedValue = searchInput.value.toLowerCase().trim();
  let filteredIngredients = recipes
    .flatMap((recipe) => recipe.ingredients)
    .filter((ingredient) =>
      ingredient.ingredient.toLowerCase().includes(searchedValue)
    )
    .map((ingredient) => ingredient.ingredient);

  options.innerHTML = "";

  if (filteredIngredients.length > 0) {
    filteredIngredients.forEach((ingredientName) => {
      let li = document.createElement("li");
      li.textContent = ingredientName;
      li.addEventListener("click", () => {
        updateIngredient(li);
        addTag(li.textContent);
      });
      options.appendChild(li);
    });
  } else {
    options.innerHTML = "<p>Aucun ingrédient</p>";
  }
});

function addAppliance(selectedAppliance) {
  optionsAppliance.innerHTML = "";
  for (const recipe of recipes) {
    let isSelected = recipe.appliance === selectedAppliance ? "select" : "";
    let li = document.createElement("li");
    li.textContent = recipe.appliance;
    li.className = isSelected;
    li.addEventListener("click", () => {
      updateAppliance(li);
      addTag(li.textContent);
    });
    optionsAppliance.appendChild(li);
  }
}

function updateAppliance(selectedLi) {
  searchInputAppliance.value = "";
  addAppliance(selectedLi.innerText);
  wrapperAppliance.classList.remove("active");
  selectBtnAppliance.firstElementChild.innerText = selectedLi.innerText;
}

searchInputAppliance.addEventListener("keyup", () => {
  let searchedValueAppliance = searchInputAppliance.value.toLowerCase().trim();
  let filteredAppliance = recipes
    .map((recipe) => recipe.appliance)
    .filter((appliance) =>
      appliance.toLowerCase().includes(searchedValueAppliance)
    );

  optionsAppliance.innerHTML = "";

  if (filteredAppliance.length > 0) {
    filteredAppliance.forEach((applianceName) => {
      let li = document.createElement("li");
      li.textContent = applianceName;
      li.addEventListener("click", () => {
        updateAppliance(li);
        addTag(li.textContent);
      });
      optionsAppliance.appendChild(li);
    });
  } else {
    optionsAppliance.innerHTML = "<p>Aucun ustensiles</p>";
  }
});

selectBtn.addEventListener("click", () => {
  wrapperIngredient.classList.toggle("active");
});

selectBtnAppliance.addEventListener("click", () => {
  wrapperAppliance.classList.toggle("active");
});

function addTag(tagName) {
  const containerTags = document.querySelector(".containerTags");
  let tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = tagName;
  tagsIngredient.appendChild(tag);
  const closeIcon = document.createElement("span");
  closeIcon.className = "tagClose";
  closeIcon.innerHTML = "&#10005;";
  closeIcon.addEventListener("click", () => {
    removeTag(tag);
  });
  tag.appendChild(closeIcon);
  containerTags.append(tagsIngredient);
}
function removeTag(tag) {
  tagsIngredient.removeChild(tag);
}
addIngredient();
addAppliance();
