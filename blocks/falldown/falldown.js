export default function decorate(block) {
  const falldownContainer = document.createElement('div');
  falldownContainer.className = 'falldown-zone';
  falldownContainer.innerHTML = block.innerHTML;

  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';

  block.innerHTML = '';
  block.append(falldownContainer, actionButton);

  const winterAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  let currentState = 0; // 0 = Noël, 1 = Zombie

  // On cible tous les éléments qui vont tomber et réapparaître
  const elementsToAnimate = Array.from(falldownContainer.querySelectorAll('p, h1, h2, h3, li, img, span, strong, em'));
  const targets = elementsToAnimate.length > 0 ? elementsToAnimate : [falldownContainer];

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();

    // --- MODE 1 : CLIC SUR NOËL (CHUTE) ---
    if (currentState === 0) {
      winterAudio.currentTime = 0;
      winterAudio.play().catch(err => console.log("Audio bloqué :", err));

      actionButton.style.setProperty('opacity', '0', 'important');
      actionButton.style.setProperty('pointer-events', 'none', 'important');

      targets.forEach((el, index) => {
        el.style.transition = 'transform 3.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.2s';
        
        const rect = el.getBoundingClientRect();
        const targetY = window.innerHeight - rect.top - 40; 
        const randomX = (Math.random() - 0.5) * 160;
        const randomRotation = (Math.random() - 0.5) * 50;

        setTimeout(() => {
          el.style.transform = `translate(${randomX}px, ${targetY}px) rotate(${randomRotation}deg)`;
          el.style.opacity = '0';
        }, index * 40);
      });

      setTimeout(() => {
        winterAudio.pause();
        falldownContainer.style.display = 'none';

        // ON APPELLE LE BLOC RISEUP POUR LE FAIRE MONTER
        if (typeof window.triggerRiseUp === 'function') {
          window.triggerRiseUp();
        }
        
        setTimeout(() => {
          actionButton.textContent = 'Rise again... 🧟‍♂️🎃';
          actionButton.style.setProperty('background-color', '#3a5f0b', 'important');
          actionButton.style.setProperty('opacity', '1', 'important');
          actionButton.style.setProperty('pointer-events', 'auto', 'important');
          currentState = 1;
        }, 50);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3200);

    // --- MODE 2 : CLIC SUR ZOMBIE (RISE AGAIN + RÉAPPARITION PETIT À PETIT) ---
    } else if (currentState === 1) {
      zombieAudio.currentTime = 0;
      zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

      // On fait s'envoler le bloc Riseup personnalisé
      if (typeof window.triggerRiseUpOut === 'function') {
        window.triggerRiseUpOut();
      }
      
      actionButton.style.setProperty('opacity', '0', 'important');
      actionButton.style.setProperty('pointer-events', 'none', 'important');

      // Attendre la fin de l'envol du texte de printemps pour faire réapparaître Falldown
      setTimeout(() => {
        zombieAudio.pause();
        falldownContainer.style.display = 'block';

        // RÉAPPARITION PETIT À PETIT : Effet cascade progressif
        targets.forEach((el, index) => {
          // On prépare l'élément invisible à sa place d'origine
          el.style.transition = 'none';
          el.style.transform = 'translate(0, 30px) rotate(0deg)'; // Légèrement décalé vers le bas
          el.style.opacity = '0';

          // On le fait apparaître un par un avec un délai croissant
          setTimeout(() => {
            el.style.transition = 'transform 1s ease-out, opacity 1s';
            el.style.transform = 'translate(0, 0) rotate(0deg)';
            el.style.opacity = '1';
          }, index * 300); // 300ms entre chaque ligne/élément (ajuste pour accélérer ou ralentir)
        });

        // Calcul du temps total de la réapparition pour afficher le bouton à la fin
        const totalRevealTime = targets.length * 300;

        setTimeout(() => {
          actionButton.textContent = 'Make it snow! 🎄❄️';
          actionButton.style.setProperty('background-color', '#0072ff', 'important');
          actionButton.style.setProperty('opacity', '1', 'important');
          actionButton.style.setProperty('pointer-events', 'auto', 'important');
          currentState = 0;
        }, totalRevealTime);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2200);
    }
  });
}
