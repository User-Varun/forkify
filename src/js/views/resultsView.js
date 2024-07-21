import View from './view';
import { generateMarkupPreview } from './view';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again :)`;
  _message = '';

  _generateMarkup() {
    return this._data.map(recipe => generateMarkupPreview(recipe)).join();
  }
}

export default new ResultsView();
