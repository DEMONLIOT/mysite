export default function decorate(block) {
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // On cible tous les paragraphes de la page
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((p) => {
      // Sécurité pour éviter de faire tomber les blocs eux-mêmes
      if (p.closest('.falldown') || p.closest('.riseup')) return;

      // On force le paragraphe à descendre en bas de l'écran
      p.style.transition = 'transform 3s ease-in, opacity 3s';
      p.style.transform = 'translateY(800px) rotate(15deg)';
      p.style.opacity = '0';
    });

    // Déclencher un événement personnalisé sur la page pour prévenir le bloc Riseup
    const event = new CustomEvent('textHasFallen');
    document.dispatchEvent(event);
  });

  block.textContent = '';
  block.append(button);
}
