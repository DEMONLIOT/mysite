export default function decorate(block) {
  block.classList.add('riseup');

  // Injecter le CSS d'animation directement pour éviter tout problème de fichier externe
  const style = document.createElement('style');
  style.textContent = `
    .riseup {
      opacity: 0 !important;
      transform: translateY(60px) !important;
      transition: transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s !important;
    }
    .riseup[data-status="active"] {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .riseup[data-status="zombie-out"] {
      opacity: 0 !important;
      transform: translateY(-100vh) !important;
      transition: transform 2.5s ease-in, opacity 2s !important;
    }
  `;
  document.head.appendChild(style);

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

    // Déclencher l'animation CSS de fuite vers le haut
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
      
      // Reset de l'attribut pour le prochain coup
      setTimeout(() => {
        block.removeAttribute('data-status');
      }, 500);

    }, 3000);
  });
}
