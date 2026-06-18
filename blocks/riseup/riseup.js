export default function decorate(block) {
  block.classList.add('riseup'); // S'assure que la classe est bien là

  const contentContainer = document.createElement('div');
  contentContainer.className = 'riseup-content';
  contentContainer.innerHTML = block.innerHTML;

  // Configuration initiale masquée en bas
  block.style.opacity = '0';
  block.style.transform = 'translateY(60px)';
  block.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';

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

  // ON EXPOSE LA FONCTION DE MONTÉE POUR QUE FALLDOWN PUISSE L'ACTIVER DIRECTEMENT
  block.triggerRise = () => {
    block.style.opacity = '1';
    block.style.transform = 'translateY(0)';
  };

  zombieButton.addEventListener('click', (e) => {
    e.preventDefault();

    zombieAudio.currentTime = 0;
    zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

    // Le bloc riseup s'enfuit vers le haut de l'écran
    block.style.transition = 'transform 2.5s ease-in, opacity 2s';
    block.style.transform = 'translateY(-100vh)';
    block.style.opacity = '0';

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
      
      // Reset discret du bloc en bas pour le coup d'après
      setTimeout(() => {
        block.style.transition = 'none';
        block.style.transform = 'translateY(60px)';
      }, 500);

    }, 3000);
  });
}
