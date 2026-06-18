export default function decorate(block) {
  // On cache le contenu du bloc au chargement en lui donnant la structure CSS
  block.classList.add('riseup');

  // On écoute le clic sur TOUTE la page pour détecter quand le bouton Falldown est pressé
  document.addEventListener('click', (event) => {
    // Si l'élément cliqué est le bouton du bloc falldown
    if (event.target.tagName === 'BUTTON' && event.target.textContent.includes('fall down')) {
      
      // On attend un tout petit peu (ex: 800ms) que le texte commence à tomber
      setTimeout(() => {
        block.classList.add('is-active');
      }, 800);
      
    }
  });
}
