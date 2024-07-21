import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.search.page;
    const totalPages = Math.ceil(
      this._data.search.results.length / this._data.search.resultsPerPage
    );

    // page 1 and there are other pages
    if (curPage === 1 && totalPages > 1)
      return this._generateMarkupBtn('next', curPage);

    // page 1 and there are no other pages
    if (curPage === 1 && totalPages === 1) return '';

    // last page
    if (curPage === totalPages && totalPages > 1)
      return this._generateMarkupBtn('previous', curPage);

    // other page
    if (curPage < totalPages) {
      return `
      ${this._generateMarkupBtn('previous', curPage)}
      ${this._generateMarkupBtn('next', curPage)}
      `;
    }
  }

  _generateMarkupBtn(btnWhich, curPage) {
    return `
    <button class="btn--inline  pagination__btn--${this._getBtnsCondition(
      'prev',
      'next',
      btnWhich
    )}" data-goTo="${this._getBtnsCondition(
      curPage - 1,
      curPage + 1,
      btnWhich
    )}" >
      <span>Page ${this._getBtnsCondition(
        curPage - 1,
        curPage + 1,
        btnWhich
      )}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${this._getBtnsCondition(
      'left',
      'right',
      btnWhich
    )}">
        </use>
      </svg>
    </button>
    `;
  }

  _getBtnsCondition(arg1, arg2, btnWhich) {
    return `${btnWhich === 'previous' ? arg1 : arg2}`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      let goTo = +btn.getAttribute('data-goTo');
      handler(goTo);
    });
  }
}
export default new PaginationView();
