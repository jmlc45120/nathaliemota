document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('contactModal');
    var modalContent = document.querySelector('.contact-modal-content');

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
        // Vérifie que le clic est en dehors de la modale elle-même (modalContent)
        if (event.target === modal && !modalContent.contains(event.target)) {
            modal.classList.remove('open');  // Retire la classe pour fermer la modale
        }
    });

    // Debugging : affichage de la liste des classes
    console.log('Modal class list:', modal.classList);
});