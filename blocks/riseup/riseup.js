export default function decorate(block) {
  // On cache le bloc au départ
  block.style.opacity = '0';
  block.style.transform = 'translateY(50px)';
  block.style.transition = 'transform 2s ease-out, opacity 2s';

  // On attend le signal du bloc falldown
  document.addEventListener('textHasFallen', () => {
    // Dès que le texte est tombé, on fait monter ce bloc au bout de 2.5 secondes
    setTimeout(() => {
      block.style.opacity = '1';
      block.style.transform = 'translateY(0)';
    }, 2500);
  });
}
