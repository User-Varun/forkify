import * as model from './model.js';
import recipeView from './views/recipeView.js';
import RecipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // rendering the spinner
    recipeView.renderSpinner();

    // rerendering the search results for highlight slected recipe feature
    if (model.getSearchResultsPage().length !== 0)
      resultsView.render(model.getSearchResultsPage());
    // rerendering bookmarks view after loading new recipe
    bookmarksView.render(model.state.bookmarks);

    // Loading Recipe

    await model.loadRecipe(id);

    // rendering Recipe
    RecipeView.render(model.state.recipe);
  } catch (err) {
    // rendering error
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    // load search results
    await model.loadSearchResults(query);

    // render search results
    resultsView.render(model.getSearchResultsPage());

    // render pagination
    paginationView.render(model.state);
  } catch (error) {
    throw error;
  }
};

const controlPagination = function (goTo) {
  console.log('pag controller ');

  // render  NEW SearchResults
  resultsView.render(model.getSearchResultsPage(goTo));

  // render new Pagination
  paginationView.render(model.state);
};

const controlServings = function (newServings) {
  console.log('serving controller ');
  // Update the servings
  model.updateServings(newServings);

  // Rerender the recipe view;
  RecipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  // adding or deleting bookmark to current recipe
  if (model.state.recipe.bookmarked) {
    // Deleting the bookmark
    model.deleteBookmark(model.state.recipe.id);

    // Deleting the bookmarks from localStorage
    model.deleteStoredData(model.state.recipe.id);

    console.log('recipe removed!');
  } else {
    // add the bookmark
    model.addBookmark(model.state.recipe);

    // storing Bookmarks to localStorage
    model.setStoreData(model.state.recipe);

    console.log('recipe added!');
  }

  // Rerender the recipe view (for bookmark btn fill)
  recipeView.render(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // upload Recipe
    await model.uploadRecipe(newRecipe);

    // render Recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // rerendering bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // hiding window
    setTimeout(addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

// puslisher-subscriber method (handler part)
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHanlderUpload(controlAddRecipe);
};

init();
