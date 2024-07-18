import * as model from './model.js';
import recipeView from './views/recipeView.js';
import RecipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
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
    resultsView.render(model.getSearchResultsPage(6));

    // render pagination
    paginationView.render(model.state);
  } catch (error) {
    throw error;
  }
};

// puslisher-subscriber method (handler part)
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
