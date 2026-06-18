export default function decorate(block) {
  block.style.opacity = '0';
  block.style.transform = 'translateY(60px)';
  block.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';

  document.addEventListener('textHasFallen', () => {
    block.style.opacity = '1';
    block.style.transform = 'translateY(0)';
  });
}
