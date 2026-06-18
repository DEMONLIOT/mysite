export default function decorate(block) {
  // 1. Créer le bouton avec un look de Noël
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  
  // 2. Musique de Noël (Jingle Bells d'ambiance)
  const audio = new Audio('https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg'); // Backup au cas où, mais mettons un vrai lien public de musique festive :
  audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; // Une musique instrumentale douce et féerique
  audio.loop = true;

  // 3. L'événement au clic
  button.addEventListener('click', () => {
    // Lancer la musique de Noël
    audio.play().catch(err => console.log("L'audio a besoin d'un clic fort pour démarrer :", err));

    // Sélectionner les éléments textuels de la page
    const textNodes = document.querySelectorAll('p, h1, h2, h3, li, span');

    textNodes.forEach((node) => {
      // Sécurité : Ne PAS faire tomber le bouton lui-même ni le texte qui va monter (Riseup)
      if (node.closest('.falldown') || node.closest('.riseup')) return;

      const text = node.textContent;
      if (!text.trim()) return;

      // Récupérer la position absolue de la ligne AVANT de la vider
      const rect = node.getBoundingClientRect();
      const originalLeft = rect.left + window.scrollX;
      const originalTop = rect.top + window.scrollY;

      // Vider le texte d'origine
      node.innerHTML = '';
      
      // Bloquer la hauteur du conteneur d'origine pour éviter que la page ne remonte d'un coup sec
      node.style.height = `${rect.height}px`;
      node.style.visibility = 'hidden'; // Cache le texte d'origine statique

      // Créer et faire tomber chaque lettre
      let currentLeftOffset = 0;
      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.classList.add('falling-letter');

        // Forcer le positionnement absolu sur l'écran pour casser le mécanisme du site
        span.style.position = 'absolute';
        span.style.left = `${originalLeft + currentLeftOffset}px`;
        span.style.top = `${originalTop}px`;
        span.style.visibility = 'visible';

        document.body.appendChild(span);

        // Estimer l'espace pour la lettre suivante (environ 9px par lettre)
        currentLeftOffset += char === ' ' ? 8 : 10;

        // Déclencher la chute immédiatement
        setTimeout(() => {
          const randomX = (Math.random() - 0.5) * 300; // Balancement gauche/droite (flocon)
          const randomRotation = (Math.random() - 0.5) * 720; // Rotation complète sur elle-même
          const targetY = window.innerHeight + window.scrollY - 40; // Tombe tout en bas de l'écran visible

          span.style.transition = 'transform 4s ease-in, opacity 4s';
          span.style.transform = `translate(${randomX}px, ${targetY - originalTop}px) rotate(${randomRotation}deg)`;
          span.style.opacity = '0.2'; // Effet flocon de neige translucide
        }, 50);
      });
    });
  });

  // Insérer le bouton dans le bloc
  block.textContent = '';
  block.append(button);
}
