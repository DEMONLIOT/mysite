export default function decorate(block) {
  block.classList.add('riseup-block');

  // On sauvegarde ton vrai texte personnalisé écrit dans ce bloc
  const contentContainer = document.createElement('div');
  contentContainer.className = 'riseup-content';
  contentContainer.innerHTML = block.innerHTML;

  // Masqué et positionné en bas au chargement de la page
  block.innerHTML = '';
  block.append(contentContainer);
  
  block.style.opacity = '0';
  block.style.transform = 'translateY(80px)';
  block.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s';
  block.style.display = 'none';

  // Fonction globale pour que le bloc Falldown puisse déclencher la montée de CE texte
  window.triggerRiseUp = () => {
    block.style.display = 'block';
    setTimeout(() => {
      block.style.opacity = '1';
      block.style.transform = 'translateY(0)';
    }, 50);
  };

  // Fonction globale pour faire disparaître ce texte vers le haut au clic de "Rise again"
  window.triggerRiseUpOut = () => {
    block.style.transition = 'transform 2.2s ease-in, opacity 1.8s';
    block.style.transform = 'translateY(-100vh)';
    block.style.opacity = '0';
    
    setTimeout(() => {
      block.style.display = 'none';
      // On le remet discrètement en position basse pour le prochain coup
      block.style.transition = 'none';
      block.style.transform = 'translateY(80px)';
    }, 2200);
  };
}
