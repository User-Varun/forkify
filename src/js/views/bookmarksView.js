import View from './view';
import { generateMarkupPreview } from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet, find a good recipe and bookmark it :)`;
  _message = '';

  _generateMarkup() {
    return this._data.map(recipe => generateMarkupPreview(recipe)).join();
  }
}

export default new BookmarksView();
