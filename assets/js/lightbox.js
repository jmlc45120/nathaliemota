document.addEventListener('DOMContentLoaded', function () {
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

    const overlay = document.querySelector('.lightbox-overlay');
    const lightboxImage = document.querySelector('.lightbox-img');
    const closeButton = document.querySelector('.lightbox-close');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');
    const referenceElement = document.querySelector('.lightbox-reference');
    const categoryElement = document.querySelector('.lightbox-category');
    let currentIndex = -1;
    let images = [];
    let references = [];
    let categories = [];
    let isDragging = false;
    let startY = 0;
    let scrollTop = 0;

    // Collecte toutes les images des icônes plein écran
    const fullscreenIcons = document.querySelectorAll('.icon-fullscreen');
    images = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-src'));
    references = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-reference'));
    categories = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-category'));

    // Fonction pour ouvrir la lightbox
    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
        referenceElement.textContent = references[currentIndex];
        categoryElement.textContent = categories[currentIndex];
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');  // Désactiver le scroll de l'arrière-plan
    }

    // Fonction pour fermer la lightbox
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.classList.remove('no-scroll');  // Réactiver le scroll de l'arrière-plan
    }

    // Fonction pour afficher l'image suivante
    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox(currentIndex);
    }

    // Fonction pour afficher l'image précédente
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox(currentIndex);
    }

    // Event listeners pour les icônes plein écran
    fullscreenIcons.forEach((icon, index) => {
        icon.addEventListener('click', (event) => {
            event.preventDefault();
            openLightbox(index);
        });
    });

    // Event listeners pour les contrôles de la lightbox
    closeButton.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);

    // Fermeture de la lightbox avec la touche Échap et navigation avec les flèches gauche/droite
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // Fermeture de la lightbox en cliquant en dehors de l'image
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === overlay) {
            closeLightbox();
        }
    });

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

    // Empêcher le comportement par défaut du navigateur lors du glisser-déposer
    lightboxImage.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
});