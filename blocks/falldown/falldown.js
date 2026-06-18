export default function decorate(block) {
  // 1. Conteneur initial visible avec textes et images
  const contentContainer = document.createElement('div');
  contentContainer.className = 'falldown-content';
  contentContainer.innerHTML = block.innerHTML;

  // On récupère les paragraphes et titres d'origine pour les faire tomber proprement
  const originalParagraphs = block.querySelectorAll('p, h1, h2, h3, li');

  // 2. Bouton de Noël
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  button.style.display = 'block';
  button.style.margin = '20px auto';
  
  block.innerHTML = '';
  block.append(contentContainer, button);

  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');

  // 3. Clic sur le bouton
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Musique
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio bloqué :", err));

    // Animation de chute sur chaque paragraphe entier (évite le bug des lettres)
    originalParagraphs.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const originalLeft = rect.left + window.scrollX;
      const originalTop = rect.top + window.scrollY;

      // Création d'un clone volant pour l'animation
      const clone = el.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = `${originalLeft}px`;
      clone.style.top = `${originalTop}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.margin = '0';
      clone.style.zIndex = '99999';
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.5s';

      document.body.appendChild(clone);

      // Lancer la chute du bloc de texte
      setTimeout(() => {
        const randomX = (Math.random() - 0.5) * 150;
        const randomRotation = (Math.random() - 0.5) * 45; // Rotation plus douce pour les blocs de texte
        const targetY = window.innerHeight + window.scrollY - 60;

        clone.style.transform = `translate(${randomX}px, ${targetY - originalTop}px) rotate(${randomRotation}deg)`;
        clone.style.opacity = '0';
      }, 50 + (index * 100)); // Léger décalage pour un effet cascade

      setTimeout(() => { clone.remove(); }, 3500);
    });

    // Masquer le contenu fixe d'origine et le bouton
    contentContainer.style.transition = 'opacity 0.4s';
    contentContainer.style.opacity = '0';
    button.style.transition = 'opacity 0.4s';
    button.style.opacity = '0';

    // 4. Fin de l'animation (au bout de 3,5 secondes)
    setTimeout(() => {
      // Couper la musique proprement
      const fadeAudio = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          audio.pause();
          audio.volume = 1.0;
        }
      }, 50);

      // Déclencher le bloc Riseup
      document.dispatchEvent(new CustomEvent('textHasFallen'));
      
      // Nettoyage
      contentContainer.remove();
      button.remove();

      // RETOUR EN HAUT DE LA PAGE : Scroll fluide vers le haut (top: 0)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, 3500);
  });
}
