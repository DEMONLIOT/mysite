export default function decorate(block) {
  // On applique la classe CSS pour masquer le bloc au départ
  block.classList.add('riseup');

  // Écouter le clic sur le bouton "Make it snow!"
  document.addEventListener('click', (event) => {
    // On vérifie que l'utilisateur a bien cliqué sur le bouton de Falldown
    if (event.target.tagName === 'BUTTON' && event.target.textContent.includes('snow')) {
      
      // La chute des lettres dure 4 secondes (4000ms).
      // On attend 3.8 secondes pour lancer la montée, juste au moment où les lettres touchent le sol !
      setTimeout(() => {
        block.classList.add('is-active');
      }, 3800); 

    }
  });
}
