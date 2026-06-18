export default function decorate(block) {
  // 1. On isole le contenu (textes, images) dans un conteneur dédié
  const contentContainer = document.createElement('div');
  contentContainer.className = 'falldown-content';
  contentContainer.innerHTML = block.innerHTML;

  // 2. On crée le bouton de Noël
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  button.style.display = 'block';
  button.style.margin = '20px auto';
  button.style.position = 'relative';
  button.style.zIndex = '1000';
  
  block.innerHTML = '';
  block.append(contentContainer, button);

  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');

  // 3. Clic sur le bouton
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Lancer la musique
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio bloqué :", err));

    // Cacher le bouton pour qu'il ne gêne pas
    button.style.transition = 'opacity 0.4s';
    button.style.opacity = '0';

    // Sélectionner tous les éléments textuels directs à l'intérieur du bloc
    const itemsToAnimate = contentContainer.querySelectorAll('p, h1, h2, h3, li, img');

    itemsToAnimate.forEach((el, index) => {
      // On force le style pour permettre l'animation sans changer sa position de départ
      el.style.display = 'block';
      el.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.5s';
      
      // Calcul de la distance jusqu'au bas de l'écran (sans toucher au haut de la page)
      const rect = el.getBoundingClientRect();
      const targetY = window.innerHeight - rect.top - 40; 
      const randomX = (Math.random() - 0.5) * 120;
      const randomRotation = (Math.random() - 0.5) * 30;

      // Déclenchement de la chute en cascade
      setTimeout(() => {
        el.style.transform = `translate(${randomX}px, ${targetY}px) rotate(${randomRotation}deg)`;
        el.style.opacity = '0';
      }, index * 150); // Effet cascade fluide
    });

    // 4. Fin de la tempête (3,5 secondes plus tard)
    setTimeout(() => {
      // Extinction propre de la musique
      const fadeAudio = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          audio.pause();
          audio.volume = 1.0;
        }
      }, 50);

      // On prévient le bloc Riseup qu'il peut apparaître
      document.dispatchEvent(new CustomEvent('textHasFallen'));
      
      // Nettoyage complet du bloc Falldown devenu invisible
      block.remove();

      // ACTION : C'est uniquement l'utilisateur qui remonte en haut de la page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, 3500);
  });
}
