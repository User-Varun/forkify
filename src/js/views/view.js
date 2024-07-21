import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Varun pawar
   * @todo Finished the basic functionality 🎉
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = ` 
  <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
}

// generating markup for results and bookamarks view; (my soluation 😊)
export const generateMarkupPreview = function (recipe) {
  const id = window.location.hash.slice(1);

  return `
       <li class="preview">
              <a class="preview__link ${
                recipe.id === id ? 'preview__link--active' : ''
              } "   href="#${recipe.id}">
                <figure class="preview__fig">
                  <img src="${recipe.image}" alt="${recipe.title}" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${recipe.title}</h4>
                  <p class="preview__publisher">${recipe.publisher}</p>
                  <div class="preview__user-generated ${
                    recipe.key ? '' : 'hidden'
                  }">
                  <svg>
                  <use href="${icons}#icon-user"></use>
                  </svg>
                  </div>
              </div>
              </a>
       </li>
      `;
};
