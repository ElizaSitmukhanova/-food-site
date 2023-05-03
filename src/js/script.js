
window.addEventListener('DOMContentLoaded', () => {
  //tabs
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(content => {
      content.classList.add('hide');
      content.classList.remove('show', 'fade');
    });
    tabs.forEach(tab => {
      tab.classList.remove('tabheader__item_active');
    });
  }
  function showTabConent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }
  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, index) => {
        if (target == tab) {
          hideTabContent();
          showTabConent(index);
        }
      });
    }
  });

  hideTabContent();
  showTabConent();

  // Timer

  const deadline = '2024-03-21';

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;

    const t = Date.parse(endtime) - Date.parse(new Date());
    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
        hours = Math.floor((t / 1000 * 60 * 60) % 24),
        minutes = Math.floor((t / 1000 / 60) % 60),
        seconds = Math.floor((t / 1000) % 60);
    }
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } /* else if (num < 0) {
      return "00";
    } */
    else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }
  setClock('.timer', deadline);

  //Modal

  const btnTrigger = document.querySelectorAll('[data-modal]'),
    modalContent = document.querySelector('.modal');

  btnTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  function openModal() {
    modalContent.classList.add('show');
    modalContent.classList.remove('hide');
    document.body.style.overflow = 'hidden'; //for scroll
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modalContent.classList.add('hide');
    modalContent.classList.remove('show');
    document.body.style.overflow = '';
  }

  modalContent.addEventListener('click', (e) => {
    if (e.target === modalContent || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modalContent.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (window.pageXOffset + document.documentElement.clientHeight >= document.
      documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  //Используем классы для карточек
  class MenuCard {
    constructor(src, alt, title,
      description, price, parentSelector,
      ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.description = description;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;

    }
    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }

      element.innerHTML = `    
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                      <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день </div>
                </div>
    `;
      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status:${res.status}`);
    }
    return await res.json();
  };

  axios.get('http://localhost:3000/menu')
    .then(data => {
      data.data.forEach(({ img, altimg, title, descr, price }) => {
        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
      });
    });

  //Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: "img/forms/spinner.svg",
    success: "Спасибо! Скоро мы с  вами свяжемся!",
    failure: "УПС! Что-то пошло не так..."
  };

  forms.forEach(form => {
    bindPostData(form);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    });
    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `;

      form.insertAdjacentElement('afterend', statusMessage);//чтобы было внизу

      const formData = new FormData(form);

      let json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        }).catch(() => {
          showThanksModal(message.failure);
        }).finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 5000);
  }

  //slider
  const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prevBtn = document.querySelector('.offer__slider-prev'),
    nextBtn = document.querySelector('.offer__slider-next'),
    current = document.querySelector('#current'),
    total = document.querySelector('#total'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1;
  let offset = 0;

  total.textContent = getZero(slides.length);

  slidesField.style.width = 200 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = width; //7.09
  });

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
        dots = [];
  //indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
              position: absolute;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 15;
              display: flex;
              justify-content: center;
              margin-right: 15%;
              margin-left: 15%;
              list-style: none;
  `;
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i+1);
    dot.style.cssText = `
                box-sizing: content-box;
                flex: 0 1 auto;
                width: 30px;
                height: 6px;
                margin-right: 3px;
                margin-left: 3px;
                cursor: pointer;
                background-color: #fff;
                background-clip: padding-box;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                opacity: .5;
                transition: opacity .6s ease;
  `;
    if (i == 0) {
      dot.style.opacity = 1;
    }
      indicators.append(dot);
      dots.push(dot);
  }
  
 function getZeroCurrent () {
  current.textContent = getZero(slideIndex);
 }

 function getOpacityDots () {
  dots.forEach(dot => dot.style.opacity = '0.5');
  dots[slideIndex-1].style.opacity = 1;
 }

  nextBtn.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    getZeroCurrent();
    getOpacityDots();
  });

  prevBtn.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    getZeroCurrent();
    getOpacityDots();
  });
  
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideToDot = e.target.getAttribute('data-slide-to');

      slideIndex = slideToDot;
      offset =  +width.slice(0, width.length - 2) * (slideToDot - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;

      getZeroCurrent();
      getOpacityDots();
    });
  });

});

