document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('contactModal');
    // var closeBtn = document.querySelector('.contact-modal-close');

    // Ouvrir la modale
    document.querySelectorAll('.open-contact-modal').forEach(function(button) {
        button.addEventListener('click', function() {
            modal.style.display = 'block';

            // Changer la valeur du champ avec jQuery
            jQuery(document).ready(function($) {
                if (typeof acfData !== 'undefined' && acfData.reference) {
                    $('input[name="your-subject"]').val(acfData.reference);
                }
            });
        });
    });

    // Fermer la modale en cliquant en dehors du contenu
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});