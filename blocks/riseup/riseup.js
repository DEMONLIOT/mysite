export default function decorate(block) {
  // Force l'ajout de la classe au cas où AEM l'enlève
  block.classList.add('riseup'); 

  // On force la section parente d'AEM à se cacher au tout début pour éviter les sauts de page
  const section = block.closest('.section');
  if (section) {
    section.style.transition = 'opacity 1s';
  }

  // Styles CSS ultra-prioritaires injectés directement
  block.style.opacity = '0';
  block.style.transform = 'translateY(100px)';
  block.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';

  // Un observateur en JS pour appliquer les styles en direct selon l'attribut
  const observer = new MutationObserver(() => {
    const status = block.getAttribute('data-status');
    if (status === 'active') {
      block.style.opacity = '1';
      block.style.transform = 'translateY(0)';
    } else if (status === 'zombie-out') {
      block.style.transition = 'transform 2.5s ease-in, opacity 2s';
      block.style.transform = 'translateY(-100vh)';
      block.style.opacity = '0';
    } else {
      // Reset à l'état initial masqué
      block.style.transition = 'none';
      block.style.opacity = '0';
      block.style.transform = 'translateY(100px)';
    }
  });
  
  observer.observe(block, { attributes: true, attributeFilter: ['data-status'] });

  const contentContainer = document.createElement('div');
  contentContainer.className = 'riseup-content';
  contentContainer.innerHTML = block.innerHTML;

  const zombieButton = document.createElement('button');
  zombieButton.textContent = 'Rise again... 🧟‍♂️🎃';
  zombieButton.style.display = 'block';
  zombieButton.style.margin = '20px auto';
  zombieButton.style.padding = '12px 24px';
  zombieButton.style.backgroundColor = '#3a5f0b';
  zombieButton.style.color = '#fff';
  zombieButton.style.border = '2px solid #1a2f05';
  zombieButton.style.borderRadius = '5px';
  zombieButton.style.cursor = 'pointer';

  block.innerHTML = '';
  block.append(contentContainer, zombieButton);

  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  zombieButton.addEventListener('click', (e) => {
    e.preventDefault();

    zombieAudio.currentTime = 0;
    zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

    block.setAttribute('data-status', 'zombie-out');

    setTimeout(() => {
      const fadeAudio = setInterval(() => {
        if (zombieAudio.volume > 0.1) {
          zombieAudio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          zombieAudio.pause();
          zombieAudio.volume = 1.0;
        }
      }, 50);

      // Réveiller Falldown
      document.dispatchEvent(new CustomEvent('zombieRiseAgain'));
      
      // On cache à nouveau la section parente d'AEM pour le prochain tour
      if (section) {
        section.style.display = 'none';
      }

      setTimeout(() => {
        block.removeAttribute('data-status');
      }, 500);

    }, 3000);
  });
}
