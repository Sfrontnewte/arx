

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

      this.menuBtn.addEventListener('click', this.openMenu.bind(this));
      this.closeBtn.addEventListener('click', this.closeMenu.bind(this));
    }

    openMenu() {
      document.body.classList.add('is-menu');
    }

    closeMenu() {
      document.body.classList.remove('is-menu');
    }
}

const menuHandler = new MenuHandler();


baguetteBox.run('.js-gallery');



var modalButtons = document.querySelectorAll('.js-open-modal'),
    overlay      = document.querySelector('.overlay'),
    closeBtn = document.querySelectorAll('.js-close-modal'),
    succesClose = document.querySelectorAll('.js-close-success'),
    page = document.querySelector('.page');

modalButtons.forEach(function(item){
    item.addEventListener('click', function(e) {
        e.preventDefault();

        var modalId = this.getAttribute('data-modal'),
            modalElem = document.querySelector('.js-modal[data-modal="' + modalId + '"]');

        modalElem.classList.add('active');
        page.classList.add('is-modal');

        page.classList.remove('is-menu');
    });
});


closeBtn.forEach(function(item){

    item.addEventListener('click', function(e) {
        if(document.querySelector('.js-modal.active')){
            document.querySelector('.js-modal.active').classList.remove('active');
        }
        page.classList.remove('is-modal');
        document.querySelector('.js-success-modal').style.display = 'none';
    });

}); // end foreach

succesClose.forEach(function(item){

    item.addEventListener('click', function(e) {
        page.classList.remove('is-modal');
        document.querySelector('.js-success-modal').style.display = 'none';
    });

}); 

document.body.addEventListener('keyup', function (e) {
    var key = e.keyCode;

    if (key == 27) {

        document.querySelector('.js-modal.active').classList.remove('active');
        page.classList.remove('is-modal');
        document.querySelector('.js-success-modal').style.display = 'none';
    };
}, false);

overlay.addEventListener('click', function() {

    if(document.querySelector('.js-modal.active')){
        document.querySelector('.js-modal.active').classList.remove('active');
        page.classList.remove('is-modal');
        document.querySelector('.js-success-modal').style.display = 'none';
    }
});

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