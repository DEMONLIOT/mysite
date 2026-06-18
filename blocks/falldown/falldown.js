export default function decorate(block) {
  // 1. Créer le bouton
  const button = document.createElement('button');
  button.textContent = 'Make the text fall down ❄️';
  
  // 2. Préparer la musique d'hiver (Audio libre de droits)
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Musique d'ambiance douce
  audio.loop = true;

  // 3. L'événement au clic
  button.addEventListener('click', () => {
    // A. Lancer la musique
    audio.play().catch(err => console.log("L'audio n'a pas pu démarrer (besoin d'une interaction utilisateur prioritaire) :", err));

    // B. Sélectionner tous les paragraphes, titres, listes de la page
    const textNodes = document.querySelectorAll('p, h1, h2, h3, li, span');

    textNodes.forEach((node) => {
      // Ignorer le bouton lui-même pour qu'il reste cliquable
      if (node.closest('.falldown')) return;

      const text = node.textContent;
      if (!text.trim()) return;

      // Vider le conteneur pour remplacer le texte par des lettres individuelles stylisées
      node.innerHTML = '';

      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Gère les espaces
        span.classList.add('falling-letter');

        // Récupérer la position exacte actuelle de la lettre sur l'écran
        const rect = node.getBoundingClientRect();
        span.style.left = `${rect.left + window.scrollX}px`;
        span.style.top = `${rect.top + window.scrollY}px`;

        // Ajouter la lettre au document
        document.body.appendChild(span);

        // Déclencher l'animation de chute après un micro-délai mécanique
        setTimeout(() => {
          const randomX = (Math.random() - 0.5) * 200; // Oscillation gauche/droite
          const randomRotation = (Math.random() - 0.5) * 360; // Rotation de la lettre
          const screenHeight = window.innerHeight;

          span.style.transform = `translate(${randomX}px, ${screenHeight}px) rotate(${randomRotation}deg)`;
          span.style.opacity = '0.3'; // Devient légèrement transparent comme de la neige
        }, 10);
      });
    });
  });

  // Nettoyer le bloc et y insérer le bouton
  block.textContent = '';
  block.append(button);
}
