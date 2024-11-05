document.addEventListener('DOMContentLoaded', function() {
    showLoader();
    window.addEventListener('load', function() {
        hideLoader();
    });
    document.addEventListener('wpcf7mailsent', function(event) {
        const responseOutput = modal.querySelector('.wpcf7-response-output');
        if (responseOutput) {
            responseOutput.style.display = 'flex'; // Affiche le message
            responseOutput.setAttribute('aria-hidden', 'false'); // Rend le message visible aux lecteurs d'écran
        }

    });
    // Variables
    const modal = document.getElementById('contactModal');
    const modalContent = document.querySelector('.contact-modal-content');
    const thumbnail = document.getElementById('thumbnail');
    const prevPhotoLink = document.querySelector('.prev-photo a');
    const nextPhotoLink = document.querySelector('.next-photo a');
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.hero-title');
    const loadMoreButton = document.getElementById('load-more');
    const loadMoreContainer = document.querySelector('.photo-archive');
    const categoryFilter = document.getElementById('category-filter');
    const formatFilter = document.getElementById('format-filter');
    const sortFilter = document.getElementById('sort-filter');
    let page = 2;
    let isLoading = false;

    const burgerMenu = document.querySelector('.burger-menu');
    const headerNav = document.querySelector('.header__nav');

    burgerMenu.addEventListener('click', function() {
        headerNav.classList.toggle('active');
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            headerNav.classList.remove('active');
        }
    });

    // Variables globales pour conserver les filtres sélectionnés
    let selectedCategory = '';
    let selectedFormat = '';
    let selectedSort = '';

    // Fonction pour afficher et masquer le loader
    function showLoader() {
        loader.style.display = 'block';
    }
    function hideLoader() {
        loader.style.display = 'none';
    }

    // Gestion du survol de l'icône oeil pour afficher les informations de la photo
    function initializeEyeIcons() {
        const eyeIcons = document.querySelectorAll('.icon-eye');
        eyeIcons.forEach(icon => {
            icon.addEventListener('mouseover', function() {
                const photoInfo = this.parentElement.querySelector('.photo-info-ovl');
                if (photoInfo) photoInfo.style.display = 'block';
            });
            icon.addEventListener('mouseout', function() {
                const photoInfo = this.parentElement.querySelector('.photo-info-ovl');
                if (photoInfo) photoInfo.style.display = 'none';
            });
        });
    }
    initializeEyeIcons();

    // Initialisation des animations pour le HERO
    if (heroImage) heroImage.style.opacity = '1';
    if (heroTitle) heroTitle.style.opacity = '1';

    function resetModal() {
        // Réinitialisation des champs de texte et textarea
        const inputs = modal.querySelectorAll('input[type="text"], input[type="email"], textarea');
        inputs.forEach(input => {
            input.value = '';
        });
    
        // Réinitialisation des messages de retour ou de validation
        const responseOutput = modal.querySelector('.wpcf7-response-output');
        if (responseOutput) {
            responseOutput.textContent = ''; // Efface le message de réponse
            responseOutput.style.display = 'none'; // Masque la div complètement
            responseOutput.setAttribute('aria-hidden', 'true'); // Cache le message aux lecteurs d'écran
        }
    }
    function displayResponseMessage(message) {
        const responseOutput = modal.querySelector('.wpcf7-response-output');
        if (responseOutput) {
            responseOutput.textContent = message;
            responseOutput.style.display = 'flex'; // Affiche la div si un message est présent
            responseOutput.setAttribute('aria-hidden', 'false'); // Montre le message pour les lecteurs d'écran
        }
    }
    // Fonction pour gérer la modale
    function initializeModal() {
        if (modal) {
            // Sélection des boutons pour ouvrir la modale
            document.querySelectorAll('.open-contact-modal').forEach(function(button) {
                button.addEventListener('click', function(event) {
                    const reference = button.getAttribute('data-reference');
                    const modalReference = document.querySelector('input[name="your-subject"]');
                    if (modalReference) {
                        modalReference.value = reference;
                    }
                    modal.classList.add('open');
                });
            });

            // Fermeture de la modale en cliquant en dehors du contenu
            window.addEventListener('click', function(event) {
                if (event.target === modal && !modalContent.contains(event.target)) {
                    modal.classList.remove('open'); // Fermeture de la modale
                    resetModal();
                }
            });
        }
    }
    // appel de la fonction
    initializeModal();

    // Fonction pour changer l'image de la miniature
    function changeThumbnail(link, thumbnail) {
        link.addEventListener('mouseover', () => thumbnail.src = link.getAttribute('data-thumbnail'));
        link.addEventListener('mouseout', () => thumbnail.src = thumbnail.getAttribute('data-current-thumbnail'));
    }

    if (prevPhotoLink) changeThumbnail(prevPhotoLink, thumbnail);
    if (nextPhotoLink) changeThumbnail(nextPhotoLink, thumbnail);

    // Fonction pour mettre à jour l'état du bouton "Charger plus"
    function updateLoadMoreButtonState() {
        loadMoreButton.disabled = false;
        loadMoreButton.textContent = 'Charger plus';
    }
    function resetLightboxListeners() {
        // Vérifie que la fonction initializeFullscreenIcons est disponible
        if (typeof initializeFullscreenIcons === 'function') {
            initializeFullscreenIcons(); // Réinitialisation des événements sur les icônes plein écran
        }
    }

    // Chargement des photos avec bouton "Charger plus"
    function loadMorePhotos() {
        if (isLoading) return;
        isLoading = true;
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = 'Chargement...';
        showLoader();
    
        // Vérifie si les filtres sont appliqués et ajuste la page en conséquence
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/wp-admin/admin-ajax.php?action=load_more_photos&page=${page}&category=${selectedCategory}&format=${selectedFormat}&sort=${selectedSort}`, true);
    
        xhr.onload = function() {
            hideLoader();
            if (xhr.status === 200) {
                const response = xhr.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                const newPhotos = doc.querySelector('.photo-grid');
    
                if (newPhotos && newPhotos.innerHTML.trim() !== '') {
                    // Ajoute les nouvelles photos à la grille
                    loadMoreContainer.querySelector('.photo-grid').insertAdjacentHTML('beforeend', newPhotos.innerHTML);
                    page++; // Incrémente la page
                    // Réinitialise les événements des icônes après le chargement de nouvelles photos
                    initializeEyeIcons();
                    resetLightboxListeners();
                    collectImages();
                    updateLoadMoreButtonState(); // Réinitialisation de l'état du bouton
                } else {
                    // Si aucune nouvelle photo, afficher un message ou désactiver le bouton
                    loadMoreButton.textContent = 'Aucune photo supplémentaire à charger.';
                    loadMoreButton.disabled = true;
                }
            } else {
                loadMoreButton.textContent = 'Erreur de chargement. Réessayez.';
            }
            isLoading = false;
        };
    
        xhr.onerror = function() {
            loadMoreButton.textContent = 'Erreur de chargement. Réessayez.';
            isLoading = false;
            loadMoreButton.disabled = false;
        };
    
        xhr.send();
    }
    
    // Assurez-vous que le bouton est présent avant d'ajouter l'événement
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMorePhotos);
    }

    // Application des filtres et tri des photos
    function applyFilters() {
        // Réinitialiser la page lors de l'application d'un filtre ou du tri
        page = 2;
        showLoader();
    
        // Mise à jour des variables globales des filtres sélectionnés
        selectedCategory = categoryFilter ? categoryFilter.querySelector('.select-selected').dataset.value || '' : '';
        selectedFormat = formatFilter ? formatFilter.querySelector('.select-selected').dataset.value || '' : '';
        selectedSort = sortFilter ? sortFilter.querySelector('.select-selected').dataset.value || '' : '';
    
        // Lancement de la requête AJAX avec les filtres sélectionnés
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/wp-admin/admin-ajax.php?action=filter_photos&category=${selectedCategory}&format=${selectedFormat}&sort=${selectedSort}`, true);
        xhr.onload = function() {
            hideLoader();
            if (xhr.status === 200) {
                const response = xhr.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                const newPhotos = doc.querySelector('.photo-grid');
    
                // Vérifier si aucun résultat n'est trouvé
                if (newPhotos && newPhotos.innerHTML.trim() !== '') {
                    loadMoreContainer.querySelector('.photo-grid').innerHTML = newPhotos.innerHTML;
                    // Réinitialiser les événements des icônes après le chargement de nouvelles photos
                    initializeEyeIcons();
                    resetLightboxListeners();
                    collectImages();
                    updateLoadMoreButtonState(); // Réinitialiser l'état du bouton
                } else {
                    // Afficher un message s'il n'y a aucun résultat
                    loadMoreContainer.querySelector('.photo-grid').innerHTML = '<p class="no-results">Aucun résultat ne correspond aux filtres sélectionnés.</p>';
                    loadMoreButton.textContent = 'Aucune photo supplémentaire à charger.';
                    loadMoreButton.disabled = true;
                }
            }
        };
        xhr.onerror = function() {
            console.error('Erreur de requête AJAX pour les filtres');
        };
        xhr.send();
    }

    // Initialisation des sélecteurs personnalisés
    function initializeCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        customSelects.forEach(function(customSelect) {
            const selected = customSelect.querySelector('.select-selected');
            const items = customSelect.querySelector('.select-items');

            // Événement pour ouvrir/fermer le menu lorsque l'utilisateur clique sur l'élément sélectionné
            selected.addEventListener('click', function(e) {
                customSelects.forEach(function(otherCustomSelect) {
                    if (otherCustomSelect !== customSelect) {
                        otherCustomSelect.querySelector('.select-items').classList.add('select-hide');
                        otherCustomSelect.querySelector('.select-selected').classList.remove('select-arrow-active');
                    }
                });
                items.classList.toggle('select-hide');
                selected.classList.toggle('select-arrow-active');
                e.stopPropagation();
            });

            // Gérer la sélection d'une option et appeler `applyFilters()` pour chaque sélection
            items.querySelectorAll('div').forEach(function(item) {
                item.addEventListener('click', function() {
                    // Si l'utilisateur sélectionne la première option vide
                    if (item.dataset.value === '') {
                        selected.textContent = selected.dataset.defaultText; // Rétablit le titre par défaut
                        selected.dataset.value = ''; // Réinitialise la valeur
                    } else {
                        selected.textContent = item.textContent; // Met à jour le texte du select
                        selected.dataset.value = item.dataset.value;
                    }
                    // Retirer la classe .selected de toutes les options et l'ajouter à l'option choisie
                    items.querySelectorAll('div').forEach(function(option) {
                        option.classList.remove('selected');
                    });
                    if (item.dataset.value !== '') {
                        item.classList.add('selected');
                    }

                    items.classList.add('select-hide');
                    selected.classList.remove('select-arrow-active');
                    applyFilters();
                });
            });
        });

        // Clic en dehors du menu pour fermer tous les menus ouverts
        document.addEventListener('click', function(e) {
            customSelects.forEach(function(customSelect) {
                const items = customSelect.querySelector('.select-items');
                const selected = customSelect.querySelector('.select-selected');
                items.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');
            });
        });
    }

    // Appel initial des fonctions de sélecteurs personnalisés si les filtres sont présents
    if (categoryFilter) initializeCustomSelects();
    if (formatFilter) initializeCustomSelects();
    if (sortFilter) initializeCustomSelects();

});