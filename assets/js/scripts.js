document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const modal = document.getElementById('contactModal');
    const modalContent = document.querySelector('.contact-modal-content');
    const thumbnail = document.getElementById('thumbnail');
    const prevPhotoLink = document.querySelector('.prev-photo a');
    const nextPhotoLink = document.querySelector('.next-photo a');
    const eyeIcons = document.querySelectorAll('.icon-eye');
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.hero-title');
    const loadMoreButton = document.getElementById('load-more');
    const loadMoreContainer = document.querySelector('.photo-archive');
    const categoryFilter = document.getElementById('category-filter');
    const formatFilter = document.getElementById('format-filter');
    const sortFilter = document.getElementById('sort-filter');
    let page = 2;
    let isLoading = false;

    // Variables globales pour conserver les filtres sélectionnés
    let selectedCategory = '';
    let selectedFormat = '';
    let selectedSort = '';

    // Initialisation des animations pour le HERO
    if (heroImage) heroImage.style.opacity = '1';
    if (heroTitle) heroTitle.style.opacity = '1';

    // Fonction pour initialiser les événements pour les icônes et la modale
    function initializePhotoEvents() {
        const eyeIcons = document.querySelectorAll('.icon-eye');

        // Gestion du survol de l'icône oeil pour afficher les informations de la photo
        eyeIcons.forEach(function(icon) {
            icon.addEventListener('mouseover', function() {
                const photoInfo = this.parentElement.querySelector('.photo-info-ovl');
                if (photoInfo) photoInfo.style.display = 'block';
            });
            icon.addEventListener('mouseout', function() {
                const photoInfo = this.parentElement.querySelector('.photo-info-ovl');
                if (photoInfo) photoInfo.style.display = 'none';
            });
        });

        // Gestion de la modale de contact
        if (modal) {
            document.querySelectorAll('.open-contact-modal').forEach(function(button) {
                button.addEventListener('click', () => modal.classList.add('open'));
            });

            // Fermeture de la modale en cliquant en dehors du contenu
            window.addEventListener('click', function(event) {
                if (event.target === modal && !modalContent.contains(event.target)) {
                    modal.classList.remove('open');
                }
            });
        }
    }

    // Fonction pour changer l'image de la miniature
    function changeThumbnail(link, thumbnail) {
        link.addEventListener('mouseover', () => thumbnail.src = link.getAttribute('data-thumbnail'));
        link.addEventListener('mouseout', () => thumbnail.src = thumbnail.getAttribute('data-current-thumbnail'));
    }

    if (prevPhotoLink) changeThumbnail(prevPhotoLink, thumbnail);
    if (nextPhotoLink) changeThumbnail(nextPhotoLink, thumbnail);

    // Chargement des photos avec bouton "Charger plus"
    function loadMorePhotos() {
        if (isLoading) return;
        isLoading = true;
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = 'Chargement...';
    
        console.log('Chargement de la page:', page);
        console.log('Catégorie sélectionnée:', selectedCategory);
        console.log('Format sélectionné:', selectedFormat);
        console.log('Tri sélectionné:', selectedSort);
    
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/wp-admin/admin-ajax.php?action=load_more_photos&page=${page}&category=${selectedCategory}&format=${selectedFormat}&sort=${selectedSort}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = xhr.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                const newPhotos = doc.querySelector('.photo-grid');
    
                if (newPhotos) {
                    loadMoreContainer.querySelector('.photo-grid').insertAdjacentHTML('beforeend', newPhotos.innerHTML);
                    page++;
                    initializePhotoEvents();
                }
                loadMoreButton.textContent = 'Charger plus';
            }
            isLoading = false;
            loadMoreButton.disabled = false;
        };
        xhr.onerror = function() {
            console.error('Erreur lors du chargement des photos');
            loadMoreButton.textContent = 'Charger plus';
            isLoading = false;
            loadMoreButton.disabled = false;
        };
        xhr.send();
    }
    if (loadMoreButton) loadMoreButton.addEventListener('click', loadMorePhotos);

    // Application des filtres et tri des photos
    function applyFilters() {
        // Réinitialiser la page lors de l'application d'un filtre ou du tri
        page = 2;
    
        // Mettre à jour les variables globales des filtres sélectionnés
        selectedCategory = categoryFilter ? categoryFilter.querySelector('.select-selected').dataset.value || '' : '';
        selectedFormat = formatFilter ? formatFilter.querySelector('.select-selected').dataset.value || '' : '';
        selectedSort = sortFilter ? sortFilter.querySelector('.select-selected').dataset.value || '' : '';
    
        console.log('Appliquer filtres avec - Catégorie:', selectedCategory, ', Format:', selectedFormat, ', Tri:', selectedSort);
    
        // Effectuer la requête AJAX avec les filtres sélectionnés
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/wp-admin/admin-ajax.php?action=filter_photos&category=${selectedCategory}&format=${selectedFormat}&sort=${selectedSort}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = xhr.responseText;
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                const newPhotos = doc.querySelector('.photo-grid');
    
                // Vérifier si aucun résultat n'est trouvé
                if (newPhotos && newPhotos.innerHTML.trim() !== '') {
                    loadMoreContainer.querySelector('.photo-grid').innerHTML = newPhotos.innerHTML;
                    initializePhotoEvents(); // Réapplique les événements aux nouveaux éléments
                } else {
                    // Afficher un message s'il n'y a aucun résultat
                    loadMoreContainer.querySelector('.photo-grid').innerHTML = '<p class="no-results">Aucun résultat ne correspond aux filtres sélectionnés.</p>';
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

// Initialiser les événements pour les icônes de la page la première fois
initializePhotoEvents();

// Débogage pour voir l'état des sélecteurs
document.querySelectorAll('.select-selected').forEach(selected => {
    selected.addEventListener('click', () => {
        console.log('Select clicked:', selected);
        console.log('Items:', selected.nextElementSibling.style.display);
    });
});
});