export default function decorate(block) {
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  
  // Musique de Noël (Jingle Bells instrumental)
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');

  button.addEventListener('click', (e) => {
    e.preventDefault();

    // 1. Lancer la musique
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio bloqué :", err));

    // 2. Cibler le texte visible de la page
    const textNodes = document.querySelectorAll('p, h1, h2, h3, li, span');

    textNodes.forEach((node) => {
      // Sécurité pour ne pas toucher aux boutons ni au texte caché de Riseup
      if (node.closest('.falldown') || node.closest('.riseup') || node.tagName === 'BUTTON') return;

      const text = node.textContent;
      if (!text.trim()) return;

      // Prendre les coordonnées du texte avant de le vider
      const rect = node.getBoundingClientRect();
      const originalLeft = rect.left + window.scrollX;
      const originalTop = rect.top + window.scrollY;

      // Figer l'espace pour éviter que la page ne saute
      node.style.height = `${rect.height}px`;
      node.style.width = `${rect.width}px`;
      node.innerHTML = '';

      let currentLeftOffset = 0;

      // Transformer chaque lettre en flocon de neige
      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;

        // Styles de départ : le texte reste exactement là où il était
        span.style.position = 'absolute';
        span.style.left = `${originalLeft + currentLeftOffset}px`;
        span.style.top = `${originalTop}px`;
        span.style.display = 'inline-block';
        span.style.zIndex = '99999';
        span.style.pointerEvents = 'none';
        span.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 4s';

        document.body.appendChild(span);
        currentLeftOffset += char === ' ' ? 8 : 11;

        // Lancer l'animation de chute
        setTimeout(() => {
          const randomX = (Math.random() - 0.5) * 200;
          const randomRotation = (Math.random() - 0.5) * 720;
          const targetY = window.innerHeight + window.scrollY - 40;

          span.style.transform = `translate(${randomX}px, ${targetY - originalTop}px) rotate(${randomRotation}deg)`;
          span.style.opacity = '0'; // Disparaît totalement à la fin de la chute
        }, 20);

        // Nettoyage des lettres à la fin de l'animation
        setTimeout(() => {
          span.remove();
        }, 4000);
      });
    });

    // 3. Arrêter la musique et prévenir le bloc Riseup après 4 secondes
    setTimeout(() => {
      // Fondu rapide pour couper la musique proprement
      const fadeAudio = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          audio.pause();
          audio.volume = 1.0; // Reset le volume pour le prochain clic
        }
      }, 50);

      // Envoyer le signal à Riseup
      const event = new CustomEvent('textHasFallen');
      document.dispatchEvent(event);
    }, 4000);
  });

  block.textContent = '';
  block.append(button);
}
