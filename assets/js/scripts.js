document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('contactModal');
    var modalContent = document.querySelector('.contact-modal-content');
    var thumbnail = document.getElementById('thumbnail');
    var prevPhotoLink = document.querySelector('.prev-photo a');
    var nextPhotoLink = document.querySelector('.next-photo a');

    // Ouvrir la modale
    document.querySelectorAll('.open-contact-modal').forEach(function(button) {
        button.addEventListener('click', function() {
            modal.classList.add('open');  // Ajoute une classe pour ouvrir la modale
        });
    });

    // Changer la valeur du champ avec jQuery
    jQuery(document).ready(function($) {
        if (typeof acfData !== 'undefined' && acfData.reference) {
            $('input[name="your-subject"]').val(acfData.reference);
        }
    });

    // Fermer la modale en cliquant en dehors du contenu
    window.addEventListener('click', function(event) {
        // Vérifie que le clic est en dehors de la modale
        if (event.target === modal && !modalContent.contains(event.target)) {
            modal.classList.remove('open');
        }

    });

    // Changer l'image de la miniature au survol des flèches
    if (prevPhotoLink) {
        console.log('Previous photo link found:', prevPhotoLink);
        prevPhotoLink.addEventListener('mouseover', function() {
            var prevPhotoThumbnail = prevPhotoLink.getAttribute('data-thumbnail'); // URL de la miniature de la photo précédente
            console.log('Previous photo thumbnail URL:', prevPhotoThumbnail);
            thumbnail.src = prevPhotoThumbnail;
            console.log('Thumbnail src updated to:', thumbnail.src);
        });

        prevPhotoLink.addEventListener('mouseout', function() {
            var currentThumbnail = thumbnail.getAttribute('data-current-thumbnail'); // URL de la miniature de la photo actuelle
            console.log('Reverting to current photo thumbnail URL:', currentThumbnail);
            thumbnail.src = currentThumbnail;
            console.log('Thumbnail src reverted to:', thumbnail.src);
        });
    }

    if (nextPhotoLink) {
        console.log('Next photo link found:', nextPhotoLink);
        nextPhotoLink.addEventListener('mouseover', function() {
            var nextPhotoThumbnail = nextPhotoLink.getAttribute('data-thumbnail'); // URL de la miniature de la photo suivante
            console.log('Next photo thumbnail URL:', nextPhotoThumbnail);
            thumbnail.src = nextPhotoThumbnail;
            console.log('Thumbnail src updated to:', thumbnail.src);
        });

        nextPhotoLink.addEventListener('mouseout', function() {
            var currentThumbnail = thumbnail.getAttribute('data-current-thumbnail'); // URL de la miniature de la photo actuelle
            console.log('Reverting to current photo thumbnail URL:', currentThumbnail);
            thumbnail.src = currentThumbnail;
            console.log('Thumbnail src reverted to:', thumbnail.src);
        });
    }
    document.querySelectorAll('.icon-fullscreen').forEach(function(icon) {
        icon.addEventListener('click', function(event) {
            event.preventDefault();
            var imgSrc = this.closest('.photo-link').querySelector('img').src;
            // Créer un lien temporaire pour utiliser Lightbox2
            var tempLink = document.createElement('a');
            tempLink.href = imgSrc;
            tempLink.setAttribute('data-lightbox', 'image-1');
            tempLink.click();
        });
    });
});