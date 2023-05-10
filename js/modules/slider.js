import { getZero } from "./timer";

function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field} ) {

    const slides = document.querySelectorAll(slide),
        slider = document.querySelector(container),
        prevBtn = document.querySelector(prevArrow),
        nextBtn = document.querySelector(nextArrow),
        current = document.querySelector(currentCounter),
        total = document.querySelector(totalCounter),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    total.textContent = getZero(slides.length);

    slidesField.style.width = 210 * slides.length + '%';
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
        dot.setAttribute('data-slide-to', i + 1);
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

    function getZeroCurrent() {
        current.textContent = getZero(slideIndex);
    }

    function getOpacityDots() {
        dots.forEach(dot => dot.style.opacity = '0.5');
        dots[slideIndex - 1].style.opacity = 1;
    }
    function cutNotDigits(not) {
        return +not.replace(/[^\d.]/g, '');
    }

    nextBtn.addEventListener('click', () => {
        if (offset == cutNotDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += cutNotDigits(width);
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
            offset = cutNotDigits(width) * (slides.length - 1);
        } else {
            offset -= cutNotDigits(width);
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
            offset = cutNotDigits(width) * (slideToDot - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            getZeroCurrent();
            getOpacityDots();
        });
    });

}

export default slider;
