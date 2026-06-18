export default function decorate(block) {
  // 1. On garde tout le contenu d'origine (textes et images) bien visible au début
  const contentContainer = document.createElement('div');
  contentContainer.className = 'falldown-content';
  contentContainer.innerHTML = block.innerHTML;

  // On extrait le texte brut pour l'animation de neige
  const originalText = block.textContent.trim();

  // 2. On crée le bouton de Noël
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  button.style.display = 'block';
  button.style.margin = '20px auto';
  
  // On vide le bloc et on y remet le contenu d'origine + le bouton
  block.innerHTML = '';
  block.append(contentContainer, button);

  // Musique de Noël (Jingle Bells instrumental)
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');

  // 3. L'événement au clic
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Lancer la musique
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio bloqué :", err));

    // Récupérer la position du bloc avant de lancer l'animation
    const rect = contentContainer.getBoundingClientRect();
    const originalLeft = rect.left + window.scrollX;
    const originalTop = rect.top + window.scrollY;

    // On fait disparaître en douceur le contenu d'origine (y compris les images du bloc)
    contentContainer.style.transition = 'opacity 0.5s ease-out';
    contentContainer.style.opacity = '0';

    // Cacher aussi le bouton
    button.style.transition = 'opacity 0.5s ease-out';
    button.style.opacity = '0';

    let currentLeftOffset = 0;
    let currentTopOffset = 0;

    // 4. Générer l'effet de neige textuelle à partir du texte d'origine
    [...originalText].forEach((char, index) => {
      if (!char.trim() && char !== ' ') return;

      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;

      // Position de départ absolue sur l'écran
      span.style.position = 'absolute';
      span.style.left = `${originalLeft + currentLeftOffset}px`;
      span.style.top = `${originalTop + currentTopOffset}px`;
      span.style.display = 'inline-block';
      span.style.zIndex = '99999';
      span.style.pointerEvents = 'none';
      span.style.fontSize = '20px';
      span.style.fontFamily = 'inherit';
      span.style.fontWeight = 'bold';
      span.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 4s';

      document.body.appendChild(span);

      // Simuler un retour à la ligne basique pour les longs textes
      currentLeftOffset += char === ' ' ? 8 : 12;
      if (currentLeftOffset > rect.width - 20) {
        currentLeftOffset = 0;
        currentTopOffset += 24;
      }

      // Lancer la chute comme des flocons de neige
      setTimeout(() => {
        const randomX = (Math.random() - 0.5) * 200;
        const randomRotation = (Math.random() - 0.5) * 720;
        const targetY = window.innerHeight + window.scrollY - 40;

        span.style.transform = `translate(${randomX}px, ${targetY - (originalTop + currentTopOffset)}px) rotate(${randomRotation}deg)`;
        span.style.opacity = '0'; // Devient invisible à la fin
      }, 50);

      // Nettoyer l'élément span après la chute
      setTimeout(() => { span.remove(); }, 4000);
    });

    // 5. Arrêter la musique et déclencher Riseup après 4 secondes
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

      // Envoyer le signal à Riseup
      document.dispatchEvent(new CustomEvent('textHasFallen'));
      
      // Supprimer définitivement les conteneurs Falldown masqués
      contentContainer.remove();
      button.remove();
    }, 4000);
  });
}
