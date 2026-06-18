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

  // Fonction qui lance la chute
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

      document.dispatchEvent(new CustomEvent('textHasFallen'));

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, 3500);
  });

  // RESET / RÉSURRECTION : Quand on clique sur "Rise again"
  document.addEventListener('zombieRiseAgain', () => {
    // On remet toutes les lignes de texte à leur place d'origine instantanément
    itemsToAnimate.forEach((el) => {
      el.style.transition = 'none';
      el.style.transform = 'translate(0, 0) rotate(0deg)';
      el.style.opacity = '1';
    });

    // On fait réapparaître le bouton de Noël
    button.style.transition = 'opacity 1s';
    button.style.opacity = '1';
    button.style.pointerEvents = 'auto';

    // On ramène doucement l'utilisateur en haut si jamais il avait bougé
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
