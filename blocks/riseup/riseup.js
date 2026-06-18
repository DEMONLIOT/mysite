export default function decorate(block) {
  // Masqué au départ
  block.style.opacity = '0';
  block.style.transform = 'translateY(60px)';
  block.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';

  // Écouter le signal de fin de la tempête de neige
  document.addEventListener('textHasFallen', () => {
    // Le texte monte à sa place
    block.style.opacity = '1';
    block.style.transform = 'translateY(0)';
  });
}
