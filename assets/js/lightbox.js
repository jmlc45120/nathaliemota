document.addEventListener('DOMContentLoaded', function () {
    const isMobile = window.innerWidth < 600;

    if (isMobile) {
        return;
    }

    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'custom-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <img src="" alt="lightbox image" class="lightbox-img">
            </div>
            <div class="lightbox-info">
                <span class="lightbox-reference"></span>
                <span class="lightbox-category"></span>
            </div>
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev"></button>
            <button class="lightbox-next"></button>
        `;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    const lightbox = createLightbox();
    const overlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxImage = lightbox.querySelector('.lightbox-img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const referenceElement = lightbox.querySelector('.lightbox-reference');
    const categoryElement = lightbox.querySelector('.lightbox-category');

    let currentIndex = -1;
    let images = [];
    let references = [];
    let categories = [];

    function collectImages() {
        // Réinitialise les tableaux pour éviter la duplication des images
        images = [];
        references = [];
        categories = [];

        document.querySelectorAll('.icon-fullscreen').forEach((icon) => {
            images.push(icon.getAttribute('data-src'));
            references.push(icon.getAttribute('data-reference'));
            categories.push(icon.getAttribute('data-category'));
        });
    }
    window.collectImages = collectImages;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
        referenceElement.textContent = references[currentIndex];
        categoryElement.textContent = categories[currentIndex];
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');
    }
    window.openLightbox = openLightbox;

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox(currentIndex);
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox(currentIndex);
    }

    function addLightboxEventListeners() {
        closeButton.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
        nextButton.addEventListener('click', showNextImage);
        prevButton.addEventListener('click', showPrevImage);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

    function initializeFullscreenIcons() {
        document.querySelectorAll('.icon-fullscreen').forEach((icon, index) => {
            icon.addEventListener('click', (event) => {
                event.preventDefault();
                openLightbox(index);
            });
        });
    }
    window.initializeFullscreenIcons = initializeFullscreenIcons;
    // Initial setup
    collectImages();
    addLightboxEventListeners();
    initializeFullscreenIcons();

    //  Fonctionnalité Drag and scroll
    lightboxImage.addEventListener('mousedown', function (e) {
        let startY = e.pageY - lightboxImage.offsetTop;
        let scrollTop = lightboxImage.parentElement.scrollTop;
        lightboxImage.style.cursor = 'grabbing';

        function onMouseMove(e) {
            e.preventDefault();
            const y = e.pageY - lightboxImage.offsetTop;
            const walk = (y - startY) * 2;
            lightboxImage.parentElement.scrollTop = scrollTop - walk;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            lightboxImage.style.cursor = 'grab';
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    lightboxImage.addEventListener('dragstart', (e) => e.preventDefault());
});