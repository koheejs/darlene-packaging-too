'use strict';

const ScreenSize = {
  SM: 768,
};

/**
 * =================================================================
 * TODO: Implement function here
 * =================================================================
 */

/**
 * Init Header navigation
 */
(function initHeaderNavigation() {
  const ACTIVE_CLASS = 'active';
  const body = document.body;
  const menuButton = document.querySelector('header .menu-button');
  const siteNav = document.querySelector('header .site-nav');

  menuButton.addEventListener('click', function (e) {
    body.classList.toggle('no-scroll');
    menuButton.classList.toggle(ACTIVE_CLASS);
    siteNav.classList.toggle(ACTIVE_CLASS);
  });

  siteNav.querySelectorAll('a').forEach(function (nav) {
    nav.addEventListener('click', function (e) {
      body.classList.toggle('no-scroll');
      menuButton.classList.toggle(ACTIVE_CLASS);
      siteNav.classList.toggle(ACTIVE_CLASS);
    });
  });
})();

/**
 * Init Slider
 */
(function initSlider() {
  function getSectionBackgrounds(element) {
    const section = element.closest('section');
    const bgListStr = section.dataset.backgrounds;
    if (!bgListStr) return { section, bgList: [] };
    const bgList = bgListStr.replace(/ /g, '').split(',');
    return { section, bgList };
  }

  function preloadImages(element) {
    const sectionBg = getSectionBackgrounds(element);
    if (!sectionBg.bgList.length) return;

    const preloadWrapper = sectionBg.section.querySelector(
      '.preload-backgrounds'
    );
    if (!preloadWrapper) return;

    preloadWrapper.insertAdjacentHTML(
      'beforeend',
      // sectionBg.bgList.map((bg) => `<img src="${bg}" />`).join('')
      sectionBg.bgList
        .map((bg) => `<div style="background-image: url(${bg})"></div>`)
        .join('')
    );
  }

  function updateBackground(index, element) {
    const sectionBg = getSectionBackgrounds(element);
    if (!sectionBg.bgList.length) return;
    sectionBg.section.style.backgroundImage =
      'url(' + sectionBg.bgList[index] + ')';
  }

  const swiper = new Swiper('.swiper', {
    speed: 400,
    spaceBetween: 100,
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function (swiper) {
        preloadImages(swiper.wrapperEl);
        updateBackground(0, swiper.wrapperEl);
      },
      slideChangeTransitionStart: function (swiper) {
        updateBackground(swiper.activeIndex, swiper.wrapperEl);
      },
    },
  });
})();

/**
 * Init FAQ selection
 */
(function initFAQSelection() {
  const ACTIVE_CLASS = 'active';
  const qnaSection = document.getElementById('qna-section');
  if (!qnaSection) return;

  const selectorOptions = qnaSection.querySelectorAll('[data-trigger]');
  const contentBox = qnaSection.querySelector('.content-box');

  function hideAllContent() {
    const contents = contentBox.querySelectorAll(`.content.${ACTIVE_CLASS}`);
    contents.forEach(function (ct) {
      ct.classList.remove(ACTIVE_CLASS);
    });
  }

  function clearActiveClass() {
    const activeOptions = qnaSection.querySelectorAll(
      `.option.${ACTIVE_CLASS}`
    );
    activeOptions.forEach(function (ct) {
      ct.classList.remove(ACTIVE_CLASS);
    });
  }

  function onSelectHandler() {
    const element = this;
    const triggerNumber = element.dataset.trigger;

    hideAllContent();
    const targetContent = contentBox.querySelector(`.content-${triggerNumber}`);
    if (targetContent) {
      clearActiveClass();
      element.classList.add(ACTIVE_CLASS);
      targetContent.classList.add(ACTIVE_CLASS);
    }
  }

  selectorOptions.forEach(function (selector) {
    selector.addEventListener('click', onSelectHandler);
  });

  selectorOptions[0].click();
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

(function initMessageForm() {
  const formElement = document.querySelector('form.message-us-form');
  if (!formElement) return;

  const formControlElements = formElement.querySelectorAll('input, textarea');

  formControlElements.forEach((formControl) => {
    const placeholder = formControl.nextElementSibling;
    if (!placeholder) return;

    placeholder.addEventListener('click', () => {
      formControl.focus();
    });

    formControl.addEventListener('input', (event) => {
      if (event.target.value) {
        formControl.classList.add('has-value');
      } else {
        formControl.classList.remove('has-value');
      }
    });
  });
})();

(function setupFormBehavior() {
  const contactForm = document.getElementById('contact-form');
  const messageForm = document.getElementById('message-form');
  const signupForm = document.getElementById('signup-form');

  function alertFailedRequest() {
    alert('Form failed to submit');
  }

  function alertSuccessRequest() {
    alert('Form submitted successfully');
  }

  function handleSendForm(form, formType) {
    const formAction = form.getAttribute('action');
    const formData = new FormData(form);

    formData.append('formType', formType);
    const searchParams = new URLSearchParams(formData).toString();

    fetch(formAction + '?' + searchParams)
      .then(function (response) {
        if (response.ok) {
          alertSuccessRequest();
          form.reset();
        } else {
          alertFailedRequest();
        }
      })
      .catch(function () {
        alertFailedRequest();
      });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSendForm(contactForm, 'contact-form');
    });
  }

  if (messageForm) {
    messageForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSendForm(messageForm, 'message-form');
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSendForm(signupForm, 'signup-form');
    });
  }
})();
