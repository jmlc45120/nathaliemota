document.addEventListener('DOMContentLoaded', function () {
    const lightbox = document.createElement('div');
    lightbox.id = 'custom-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <img src="" alt="lightbox image" class="lightbox-img">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">prev</button>
            <button class="lightbox-next">next</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const overlay = document.querySelector('.lightbox-overlay');
    const lightboxImage = document.querySelector('.lightbox-img');
    const closeButton = document.querySelector('.lightbox-close');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');
    let currentIndex = -1;
    let images = [];

    // Collecte toutes les images des icônes plein écran
    const fullscreenIcons = document.querySelectorAll('.icon-fullscreen');
    images = Array.from(fullscreenIcons).map(icon => icon.getAttribute('data-src'));

    // Fonction pour ouvrir la lightbox
    function openLightbox(index) {
        currentIndex = index;
        lightboxImage.src = images[currentIndex];
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
});