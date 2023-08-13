

const pageSliders = document.querySelectorAll('.page-slider');

for (let i = 0; i < pageSliders.length; i++) {
    const pageSlider = new Splide(pageSliders[i], {
        type   : 'loop',
        drag   : 'free',
        focus  : 'center',
        perPage: 3,
        autoWidth: true,
        arrows: false,
        pagination: false,
        autoScroll: {
            pauseOnHover: true,
            pauseOnFocus: false
        }
    });

    pageSlider.mount( window.splide.Extensions );
}


const sectionSliders = document.querySelectorAll('.js-section-slider');

for (let i = 0; i < sectionSliders.length; i++) {
    const pageSlider = new Splide(sectionSliders[i], {
        type   : 'loop',
        focus  : 'center',
        perPage: 1,
        autoWidth: true,
        arrows: false,
        pagination: true,
        gap: '16px',
        mediaQuery: 'min',
        breakpoints: {
            767: { 
                arrows: true,
                gap: '30px',
                focus  : 'auto'
            },
        },
    });

    pageSlider.mount();
}

function handleButtonClick(button, list) {
    list.classList.add('is-active');
    button.remove();
}
  
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.section__show-more');
    buttons.forEach(button => {
      const sectionContainer = button.closest('.section__container');
      const list = sectionContainer.querySelector('.section__list');
      
      button.addEventListener('click', () => handleButtonClick(button, list));
    });
});



class CardGrid {
    constructor() {
        this.initShow = 8;
        this.counter = 4;
        this.tgb = document.querySelector('.section__load-more-cards');
        this.isoContainer = null;
    
        this.initIsotope();
        this.initFilters();
        this.initButtonGroups();
        this.initLoadMore();
        this.initLayoutOnResize(); 
        this.initLayoutOnOrientationChange();
        this.initLoadOnWindowLoad();
    }
  
    initIsotope() {
      this.iso = new Isotope('.js-section-grid', {
        itemSelector: '.js-section-grid .grid__col',
        layoutMode: 'masonry',
        resize: true
      });
  
      this.isoContainer = Isotope.data('.js-section-grid');
    }
  
    initFilters() {
      const filterFns = {
        numberGreaterThan50: function (itemElem) {
          const number = itemElem.querySelector('.number').textContent;
          return parseInt(number, 10) > 50;
        },
        ium: function (itemElem) {
          const name = itemElem.querySelector('.name').textContent;
          return name.match(/ium$/);
        }
      };
  
      const filtersElem = document.querySelector('.filters-button-group');
      filtersElem.addEventListener('click', (event) => {
        if (!event.target.matches('button')) {
          return;
        }
        const filterValue = event.target.getAttribute('data-filter');
        const filterFn = filterFns[filterValue] || filterValue;
        this.iso.arrange({ filter: filterFn });
        this.loadMore(4);
      });
    }
  
    initButtonGroups() {
      const buttonGroups = document.querySelectorAll('.button-group');
      buttonGroups.forEach((buttonGroup) => {
        this.radioButtonGroup(buttonGroup);
      });
    }
  
    radioButtonGroup(buttonGroup) {
      buttonGroup.addEventListener('click', (event) => {
        if (!event.target.matches('button')) {
          return;
        }
        const activeButton = buttonGroup.querySelector('.is-active');
        if (activeButton) {
          activeButton.classList.remove('is-active');
        }
        event.target.classList.add('is-active');
      });
    }
  
    loadMore(toShow) {
      const hd = document.querySelectorAll('.hidden-el');
  
      hd.forEach((hiddenEl) => {
        hiddenEl.classList.remove('hidden-el');
      });
  
      const hiddenElems = this.isoContainer.filteredItems
        .slice(toShow, this.isoContainer.filteredItems.length)
        .map((item) => item.element);
  
      hiddenElems.forEach((hiddenElem) => {
        hiddenElem.classList.add('hidden-el');
      });
  
      this.isoContainer.layout();
  
      if (hiddenElems.length === 0) {
        this.tgb.classList.remove('show');
      } else {
        this.tgb.classList.add('show');
      }
    }
  
    initLoadMore() {
      this.tgb.addEventListener('click', () => {
        this.counter += this.initShow;
        this.loadMore(this.counter);
      });
    }

    initLayoutOnResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            
            this.iso.updateSortData('.js-section-sorting')
            this.iso.reloadItems()
          }, 10); 
        });
      }

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }
    
      initLayoutOnOrientationChange() {
        const debounceLayout = this.debounce(() => {
          this.iso.layout();
        }, 400);
    
        window.addEventListener('orientationchange', debounceLayout);
      }
  
    initLoadOnWindowLoad() {
      window.addEventListener('load', () => {
        this.loadMore(8);
      });
    }
}
  
const cardGrid = new CardGrid();
  

class MenuHandler {
  constructor() {
    this.menuBtn = document.querySelector('.header__menu-btn');
    this.closeBtn = document.querySelector('.header-menu__close');
    this.links = document.querySelectorAll('.header-menu__link');

    this.menuBtn.addEventListener('click', this.openMenu.bind(this));
    this.closeBtn.addEventListener('click', this.closeMenu.bind(this));

    this.links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        this.closeMenu();
        const targetSectionId = link.getAttribute('href');
        this.scrollToSection(targetSectionId);
      });
    });
  }

  openMenu() {
    document.body.classList.add('is-menu');
  }

  closeMenu() {
    document.body.classList.remove('is-menu');
  }

  scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      });
    }
  }
}
const menuHandler = new MenuHandler();


class StickyHeaderManager {
  constructor() {
    this.header = document.querySelector(".header");
    this.headerHeight = this.header.offsetHeight;
    
    window.addEventListener("scroll", this.handleScroll.bind(this));
    
    document.addEventListener("DOMContentLoaded", () => {
      this.handleScroll();
    });

  }

  handleScroll() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > this.headerHeight) {
      this.header.classList.add("sticky");
    } else {
      this.header.classList.remove("sticky");
    }
  }
}

new StickyHeaderManager;


class ModalManager {
  constructor() {
      this.modalButtons = document.querySelectorAll('.js-open-modal');
      this.overlay = document.querySelector('.overlay');
      this.page = document.querySelector('.page');
      this.activeModal = null;

      this.modalButtons.forEach(item => {
          item.addEventListener('click', e => this.openModal(e));
      });


      this.overlay.addEventListener('click', e => this.closeModal());


      document.body.addEventListener('click', e => this.handleBodyClick(e));
      document.body.addEventListener('keyup', e => this.handleKeyPress(e), false);
  }

  openModal(e) {
      e.preventDefault();

      const modalId = e.target.getAttribute('data-modal');
      this.activeModal = document.querySelector(`.js-modal[data-modal="${modalId}"]`);

      if (this.activeModal) {
          this.activeModal.classList.add('active');
          this.page.classList.add('is-modal');
          this.page.classList.remove('is-menu');
          this.page.classList.remove('is-media-modal');
      }
  }

  closeModal() {
    document.querySelectorAll('.js-modal').forEach(option => {
      option.classList.remove('active');
    });

    document.querySelector('body').classList.remove('is-modal');
  }

  handleBodyClick(e) {
      const closeBtn = e.target.closest('.js-close-modal');
      if (closeBtn) {
          this.closeModal();
      }
  }

  handleKeyPress(e) {
      if (e.keyCode === 27) {
          this.closeModal();
      }
  }
}

const modalManager = new ModalManager();

var eventCalllback = function (e) {
    var el = e.target,
    clearVal = el.dataset.phoneClear,
    pattern = el.dataset.phonePattern,
    matrix_def = "+7 ___ ___ __ __",
    matrix = pattern ? pattern : matrix_def,
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = e.target.value.replace(/\D/g, "");
    if (clearVal !== 'false' && e.type === 'blur') {
        if (val.length < matrix.match(/([\_\d])/g).length) {
            e.target.value = '';
            return;
        }
    }
    if (def.length >= val.length) val = def;
    e.target.value = matrix.replace(/./g, function (a) {
        return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
    });
}
var phone_inputs = document.querySelectorAll('input[type="tel"]');
for (let elem of phone_inputs) {
    for (let ev of ['input', 'blur', 'focus']) {
        elem.addEventListener(ev, eventCalllback);
    }
}



class CustomSelect {
    constructor(container) {
        this.container = container;
        this.inner = this.container.querySelector('.custom-select__field');
        this.selectInput = this.container.querySelector('.select-input');
        this.selectDropdown = this.container.querySelector('.select-dropdown');
        this.selectOptions = this.container.querySelectorAll('.select-option');

        this.inner.addEventListener('click', this.toggleDropdown.bind(this));

        this.selectOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectInput.value = option.textContent;
                this.closeDropdown();
            });
        });

        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    toggleDropdown() {
      this.container.classList.toggle('active');
    }

    closeDropdown() {
      this.container.classList.remove('active');
    }

    handleDocumentClick(event) {
      if (!this.container.contains(event.target)) {
        this.closeDropdown();
      }
    }
}

const customSelects = document.querySelectorAll('.custom-select');
customSelects.forEach(select => new CustomSelect(select));

var dpBelow = TinyDatePicker('.js-calendar', {
    mode: 'dp-below',
    lang: {
        days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        today: 'Сегодня',
        clear: 'Очистить',
        close: 'Закрыть'
      }
});

class Gallery {
  constructor(parentClass, modalSliderClass) {
      this.parentClass = parentClass;
      this.modalSliderClass = modalSliderClass;
      this.activeSlideIndex = 0; 

      this.initialize();
  }

  initialize() {
      const parentSections = document.querySelectorAll(`.${this.parentClass}`);
      parentSections.forEach((parent) => {
          const previewCards = parent.querySelectorAll('[data-full-image]');
          const modalSlider = parent.querySelector(`.${this.modalSliderClass}`);
          const modal = parent.querySelector('.js-gallery-modal');
          const closeModal = parent.querySelectorAll('.js-close-gallery');

          previewCards.forEach((card, index) => {
              card.addEventListener('click', () => this.openModal(modal, modalSlider, previewCards, index));
          });

          closeModal.forEach((card) => {
            card.addEventListener('click', () => this.closeModalFunction(modal));
        });

      });
  }

  openModal(modal, modalSlider, previewCards, index) {
      document.querySelector('body').classList.add('is-modal');
      modal.style.display = 'flex';
      modalSlider.innerHTML = '';

      const originalSlides = Array.from(previewCards).filter((slide) => !slide.classList.contains('splide__slide--clone'));

      originalSlides.forEach((slide, slideIndex) => {
          const slideImage = slide.getAttribute('data-full-image');
          const slideDiv = document.createElement('div');
          slideDiv.classList.add('splide__slide');
          slideDiv.innerHTML = `<img src="${slideImage}" alt="">`;
          modalSlider.appendChild(slideDiv);
      });

      this.activeSlideIndex = index;

      const modalSliders = modal.querySelectorAll('.js-modal-slider');

      for (let i = 0; i < modalSliders.length; i++) {
          const pageSlider = new Splide(modalSliders[i], {
              type: 'loop',
              focus: 'center',
              perPage: 1,
              arrows: true,
              pagination: false,
              start: this.activeSlideIndex,
          });

          pageSlider.mount();
      }
  }

  closeModalFunction(modal) {
      modal.style.display = 'none';
      document.querySelector('body').classList.remove('is-modal');
  }
}

const gallery = new Gallery('js-gallery-section', 'js-modal-slider .splide__list');



class Catalog {
  constructor(parentClass, modalSliderClass) {
    this.parentClass = parentClass;
    this.modalSliderClass = modalSliderClass;
    this.activeSlideIndex = 0;

    this.initialize();
  }

  initialize() {
    const parentSections = document.querySelectorAll(`.${this.parentClass}`);
    parentSections.forEach((parent) => {
      const previewCards = parent.querySelectorAll('.catalog-card');
      const modalSlider = parent.querySelector(`.${this.modalSliderClass}`);
      const modal = parent.querySelector('.js-catalog-modal');
      const closeModal = parent.querySelectorAll('.js-close-gallery');
      const showModal = parent.querySelectorAll('.grid__col .catalog-card__btn');

      previewCards.forEach((card, index) => {
        card.addEventListener('click', () => this.openModal(modal, modalSlider, card));
      });

      closeModal.forEach((card) => {
        card.addEventListener('click', () => this.closeModalFunction(modal));
      });

      showModal.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      });
    });

    
  }

  openModal(modal, modalSlider, clickedCard) {
    document.querySelector('body').classList.add('is-media-modal');
    modal.style.display = 'flex';
    modalSlider.innerHTML = '';
  

    const cardHTML = clickedCard.outerHTML;

    const close = document.createElement('div');
    close.classList.add('modal-gallery__close');
    close.classList.add('js-close-gallery');

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('splide__slide');
    
    slideDiv.innerHTML = cardHTML;

    modalSlider.innerHTML = cardHTML;
    modalSlider.appendChild(close);
    
    
    const catalogSlider = document.querySelector('.modal-gallery .js-catalog-slider');

    const pageSlider = new Splide(catalogSlider, {
      type: 'loop',
      focus: 'center',
      perPage: 1,
      arrows: true,
      pagination: false
    });
    pageSlider.mount();

    document.querySelector('.modal-gallery .catalog-card__btn').addEventListener('click', e => this.openModalOrder(e));

    close.addEventListener('click', () => this.closeModalFunction(modal));


  }

  closeModalFunction(modal) {
    modal.style.display = 'none';
    document.querySelector('body').classList.remove('is-media-modal');
  }

  openModalOrder(e, modal) {

    const modalId = e.target.getAttribute('data-modal');
    this.activeModal = document.querySelector(`.js-modal[data-modal="${modalId}"]`);
    
    document.querySelector('.js-catalog-modal').style.display = 'none';
    document.querySelector('body').classList.remove('is-media-modal');
  

    if (this.activeModal) {
        this.activeModal.classList.add('active');
        document.querySelector('body').classList.add('is-modal');
        document.querySelector('body').classList.remove('is-menu');
        document.querySelector('body').classList.remove('is-media-modal');
    }
}
}

const catalog = new Catalog('js-section-sorting', 'js-catalog-modal .modal-gallery__content');




document.querySelector('.js-modal').addEventListener('submit', function(e){

  if(name.value.length <= 2){
      name.parentNode.classList.add('error');
  } else {
      name.parentNode.classList.remove('error');
  }

  if(tel.value.length <= 11){
      tel.parentNode.classList.add('error');
  } else {
      tel.parentNode.classList.remove('error');
  }


  if(name.value.length >= 3 && tel.value.length){
      e.preventDefault();
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() { 

          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              console.log('success');
              document.querySelector('.js-modal.active').classList.remove('active');
              document.querySelector('.js-success-modal').style.display = 'inline-flex';
              name.value = "";
              tel.value = "";
          }
      }

          request.open(this.method, this.action, true);

          var data = new FormData(this);
          for (var key of data.keys());
              
          request.send(data);
  } else {
      e.preventDefault();
  }
  
});