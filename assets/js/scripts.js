document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('contactModal');
    var closeBtn = document.querySelector('.contact-modal-close');

    // Ouvrir la modale
    document.querySelectorAll('.open-contact-modal').forEach(function(button) {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    });

    // Fermer la modale en cliquant en dehors du contenu
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});