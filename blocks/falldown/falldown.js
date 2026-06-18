export default function decorate(block) {
  const contentContainer = document.createElement('div');
  contentContainer.className = 'falldown-content';
  contentContainer.innerHTML = block.innerHTML;

  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  button.style.display = 'block';
  button.style.margin = '20px auto';
  button.style.position = 'relative';
  button.style.zIndex = '1000';
  
  block.innerHTML = '';
  block.append(contentContainer, button);

  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const itemsToAnimate = contentContainer.querySelectorAll('p, h1, h2, h3, li, img');

  button.addEventListener('click', (e) => {
    e.preventDefault();

    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio bloqué :", err));

    button.style.transition = 'opacity 0.4s';
    button.style.opacity = '0';
    button.style.pointerEvents = 'none';

    itemsToAnimate.forEach((el, index) => {
      el.style.display = 'block';
      el.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.5s';
      
      const rect = el.getBoundingClientRect();
      const targetY = window.innerHeight - rect.top - 40; 
      const randomX = (Math.random() - 0.5) * 120;
      const randomRotation = (Math.random() - 0.5) * 30;

      setTimeout(() => {
        el.style.transform = `translate(${randomX}px, ${targetY}px) rotate(${randomRotation}deg)`;
        el.style.opacity = '0';
      }, index * 150);
    });

    // Fin de la tempête (3,5 secondes)
    setTimeout(() => {
      const fadeAudio = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          audio.pause();
          audio.volume = 1.0;
        }
      }, 50);

      // FORCE LE BLOC RISEUP À MONTER DIRECTEMENT
      const riseupBlock = document.querySelector('.riseup');
      if (riseupBlock && typeof riseupBlock.triggerRise === 'function') {
        riseupBlock.triggerRise();
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, 3500);
  });

  // Reçu quand on clique sur "Rise again"
  document.addEventListener('zombieRiseAgain', () => {
    itemsToAnimate.forEach((el) => {
      el.style.transition = 'none';
      el.style.transform = 'translate(0, 0) rotate(0deg)';
      el.style.opacity = '1';
    });

    button.style.transition = 'opacity 1s';
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
