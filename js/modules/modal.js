function openModal(modalSelector, modalTimerId) {
    const modalContent = document.querySelector(modalSelector);
    
    modalContent.classList.add('show');
    modalContent.classList.remove('hide');
    document.body.style.overflow = 'hidden'; //for scroll

    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
   const modalContent = document.querySelector(modalSelector);
    modalContent.classList.add('hide');
    modalContent.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    const btnTrigger = document.querySelectorAll(triggerSelector),
        modalContent = document.querySelector(modalSelector);

    btnTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });

    modalContent.addEventListener('click', (e) => {
        if (e.target === modalContent || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalContent.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if (window.pageXOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {openModal, closeModal};