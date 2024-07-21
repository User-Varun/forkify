import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';
import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const getRecipeObject = function (data) {
  const { recipe } = data;

  console.log(recipe);

  return {
    id: recipe.id,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const { data } = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = getRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // update the ingredients array
  state.recipe.ingredients.forEach(ing => {
    // updating ingredients
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // formula: newQt = oldQt * (newServing / oldServing)
  });
  // reseting servings
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(res => res.id === id);

  // Delete bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

export const setStoreData = function (recipe) {
  localStorage.setItem(recipe.id, JSON.stringify(recipe));
};

export const deleteStoredData = function (id) {
  localStorage.removeItem(id);
};

const getStoreData = function () {
  const data = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    const item = localStorage.getItem(key);

    data.push(JSON.parse(item));
  }

  return data;
};
const init = function () {
  // in Starting Setting the bookmarks to data from localStorage;
  state.bookmarks = getStoreData();
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients format! please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity, unit: unit, description: description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    console.log(data.data);
    state.recipe = getRecipeObject(data.data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
