export default function decorate(block) {
  // Masqué au tout début
  block.style.opacity = '0';
  block.style.transform = 'translateY(40px)';
  block.style.transition = 'transform 2s ease-out, opacity 2s';

  // Écouter le signal de fin du blizzard
  document.addEventListener('textHasFallen', () => {
    // Le texte monte immédiatement à la place libre
    block.style.opacity = '1';
    block.style.transform = 'translateY(0)';
  });
}
