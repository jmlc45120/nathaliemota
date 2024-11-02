document.addEventListener('DOMContentLoaded', function () {
    const isMobile = window.innerWidth < 450; // Par exemple, écran moins de 768px

    if (isMobile) {
        console.log("Lightbox désactivée sur mobile.");
        return; // Quitte la fonction si l'appareil est mobile
    }
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
    let isDragging = false;
    let startY = 0;
    let scrollTop = 0;

    function collectImages() {
        const fullscreenIcons = document.querySelectorAll('.icon-fullscreen');
        images = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-src'));
        references = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-reference'));
        categories = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-category'));
    }

    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
        referenceElement.textContent = references[currentIndex];
        categoryElement.textContent = categories[currentIndex];
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');  // Désactiver le scroll de l'arrière-plan
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.classList.remove('no-scroll');  // Réactiver le scroll de l'arrière-plan
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
        const fullscreenIcons = document.querySelectorAll('.icon-fullscreen');
        fullscreenIcons.forEach((icon, index) => {
            icon.addEventListener('click', (event) => {
                event.preventDefault();
                openLightbox(index);
            });
        });
    }

    // Collecte les images lors du chargement
    collectImages();
    addLightboxEventListeners();
    initializeFullscreenIcons();

    // Ajout des événements de glisser-déposer pour le défilement
    lightboxImage.addEventListener('mousedown', function (e) {
        isDragging = true;
        startY = e.pageY - lightboxImage.offsetTop;
        scrollTop = lightboxImage.parentElement.scrollTop;
        lightboxImage.style.cursor = 'grabbing'; // Changer le curseur en mode "grabbing"
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        const y = e.pageY - lightboxImage.offsetTop;
        const walk = (y - startY) * 2; // Multipliez par 2 pour augmenter la vitesse de défilement
        lightboxImage.parentElement.scrollTop = scrollTop - walk;
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
        lightboxImage.style.cursor = 'grab'; // Revenir au curseur "grab"
    });

    lightboxImage.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
});