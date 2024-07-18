import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    console.log(this._data);

    const totalPages = Math.ceil(
      this._data.search.results.length / this._data.search.resultsPerPage
    );
    const curPage = this._data.search.page;

    console.log(curPage);
    console.log(totalPages);

    // page 1 and there are other pages
    if (curPage === 1 && totalPages > 1)
      return this._generateMarkupHtmlPagination('next', curPage);

    // page 1 and there are no other pages
    if (curPage === 1 && totalPages === 1) return '';

    // last page
    if (curPage === totalPages)
      return this._generateMarkupHtmlPagination('previous', curPage);

    // other page
    return (this._generateMarkupHtmlPagination('previous', curPage),
    this._generateMarkupHtmlPagination('next', curPage)).join();
  }

  _generateMarkupHtmlPagination(btnWhich, curPage) {
    return `
      <button class="btn--inline pagination__btn--${
        btnWhich === 'previous' ? 'prev' : 'next'
      }">
      <span>Page ${btnWhich === 'previous' ? curPage - 1 : curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${
      btnWhich === 'previous' ? 'left' : 'right'
    }"></use>
              </svg>
      </button>
    `;
  }
}
export default new PaginationView();
