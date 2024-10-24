document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('contactModal');
    var modalContent = document.querySelector('.contact-modal-content');
    var thumbnail = document.getElementById('thumbnail');
    var prevPhotoLink = document.querySelector('.prev-photo a');
    var nextPhotoLink = document.querySelector('.next-photo a');
    var eyeIcons = document.querySelectorAll('.icon-eye');
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.hero-title');

    // Déclenchement des animations pour le HERO
    heroImage.style.opacity = '1';
    heroTitle.style.opacity = '1';

    eyeIcons.forEach(function(icon) {
        // Survol de l'icône oeil
        icon.addEventListener('mouseover', function() {
            var photoInfo = this.parentElement.querySelector('.photo-info-ovl');
            if (photoInfo) {
                photoInfo.style.display = 'block'; // Affiche les informations
            }
            else{
                console.log('No photo info');
            }});


        // Quand on arrête de survoler l'icône
        icon.addEventListener('mouseout', function() {
            var photoInfo = this.parentElement.querySelector('.photo-info-ovl');
            if (photoInfo) {
                photoInfo.style.display = 'none'; // Cache les informations
            }
        });
    });


    // Vérifiez que modal existe avant d'ajouter des écouteurs d'événements
    if (modal) {
        // Ouvrir la modale
        document.querySelectorAll('.open-contact-modal').forEach(function(button) {
            button.addEventListener('click', function() {
                modal.classList.add('open');  // Ajoute une classe pour ouvrir la modale
            });
        });

        // Change la valeur du champ avec jQuery
        jQuery(document).ready(function($) {
            if (typeof acfData !== 'undefined' && acfData.reference) {
                $('input[name="your-subject"]').val(acfData.reference);
            }
        });

        // Ferme la modale en cliquant en dehors du contenu
        window.addEventListener('click', function(event) {
            if (event.target === modal && !modalContent.contains(event.target)) {
                modal.classList.remove('open');
            }
        });
    }

    // Fonction pour changer l'image de la miniature
    function changeThumbnail(link, thumbnail) {
        link.addEventListener('mouseover', function() {
            thumbnail.src = link.getAttribute('data-thumbnail');
        });
        link.addEventListener('mouseout', function() {
            thumbnail.src = thumbnail.getAttribute('data-current-thumbnail');
        });
    }

    // Changer l'image de la miniature au survol des flèches
    if (prevPhotoLink) changeThumbnail(prevPhotoLink, thumbnail);
    if (nextPhotoLink) changeThumbnail(nextPhotoLink, thumbnail);

    // Pagination infinie
    var page = 2;
    var loadMoreButton = document.getElementById('load-more');
    var loadMoreContainer = document.querySelector('.photo-archive');

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/wp-admin/admin-ajax.php?action=load_more_photos&page=' + page, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var response = xhr.responseText;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response, 'text/html');
                    var newPhotos = doc.querySelector('.photo-grid');
                    if (newPhotos) {
                        loadMoreContainer.querySelector('.photo-grid').insertAdjacentHTML('beforeend', newPhotos.innerHTML);
                        page++;
                    }
                }
            };
            xhr.onerror = function() {
                console.error('Ajax request error');
            };
            xhr.send();
        });
    }

    // Filtres et tri
    var categoryFilter = document.getElementById('category-filter');
    var formatFilter = document.getElementById('format-filter');
    var sortFilter = document.getElementById('sort-filter');

    function applyFilters() {
        var category = categoryFilter ? categoryFilter.value : '';
        var format = formatFilter ? formatFilter.value : '';
        var sort = sortFilter ? sortFilter.value : '';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/wp-admin/admin-ajax.php?action=filter_photos&category=' + category + '&format=' + format + '&sort=' + sort, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(response, 'text/html');
                var newPhotos = doc.querySelector('.photo-grid');
                if (newPhotos) {
                    loadMoreContainer.querySelector('.photo-grid').innerHTML = newPhotos.innerHTML;
                }
            }
        };
        xhr.onerror = function() {
            console.error('Ajax request error');
        };
        xhr.send();
    }

    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (formatFilter) formatFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
});