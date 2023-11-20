'use strict';

const ScreenSize = {
  SM: 768,
};

/**
 * =================================================================
 * TODO: Implement function here
 * =================================================================
 */

(function menuEffect() {
  console.log('app init');
})();

/**
 * Adjusts the height of columns within a specific section of a webpage to be the same height as the tallest column.
 */
(function adjustSameHeight() {
  const servicesList = document.getElementById('services-list');
  if (!servicesList) return;

  const titles = Array.from(servicesList.getElementsByClassName('title'));
  const description = Array.from(
    servicesList.getElementsByClassName('description')
  );

  // Adjusts the height of the columns.
  function makeSameHeight(elements) {
    elements.forEach((element) => {
      element.style.height = '';
    });

    if (window.innerWidth <= ScreenSize.SM) return;

    const maxHeight = elements.reduce((maxHeight, element) => {
      return Math.max(maxHeight, element.clientHeight);
    }, 0);

    elements.forEach((element) => {
      element.style.height = `${Math.ceil(maxHeight)}px`;
    });
  }

  function makeSameTitleHeight() {
    makeSameHeight(titles);
  }

  function makeSameDescriptionHeight() {
    makeSameHeight(description);
  }

  window.addEventListener('resize', _.debounce(makeSameTitleHeight, 50));
  window.addEventListener('resize', _.debounce(makeSameDescriptionHeight, 50));
  window.dispatchEvent(new Event('resize'));
})();
