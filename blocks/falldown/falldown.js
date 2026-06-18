export default function decorate(block) {
  // 1. ON SÉPARE LE CONTENU DU DÉBUT (FALLLDOWN) ET DU PRINTEMPS (RISEUP)
  // On récupère toutes les sections ou paragraphes présents dans le bloc d'origine
  const originalElements = Array.from(block.children);
  
  // Le premier élément (ou première ligne/case) sera le texte Falldown
  // Le deuxième élément (ou deuxième case de ton tableau Word) sera le texte Riseup
  const falldownSource = originalElements[0] ? originalElements[0].innerHTML : block.innerHTML;
  const riseupSource = originalElements[1] ? originalElements[1].innerHTML : "<p>🌸 Bienvenue au printemps !</p>";

  // 2. ON CRÉE LA STRUCTURE PROPRE DANS LA PAGE
  block.innerHTML = ''; // On vide tout pour éviter les bugs d'AEM

  // Conteneur Falldown (Noël)
  const falldownContainer = document.createElement('div');
  falldownContainer.innerHTML = falldownSource;
  falldownContainer.style.transition = 'opacity 0.5s';

  // Conteneur Riseup (Printemps) - Caché au tout début
  const riseupContainer = document.createElement('div');
  riseupContainer.innerHTML = riseupSource;
  riseupContainer.style.opacity = '0';
  riseupContainer.style.transform = 'translateY(100px)';
  riseupContainer.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';
  riseupContainer.style.display = 'none'; // Totalement invisible au début

  // Bouton Principal
  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';
  actionButton.style.display = 'block';
  actionButton.style.margin = '20px auto';
  actionButton.style.padding = '12px 24px';
  actionButton.style.fontSize = '18px';
  actionButton.style.cursor = 'pointer';
  actionButton.style.position = 'relative';
  actionButton.style.zIndex = '1000';
  actionButton.style.transition = 'all 0.5s';

  block.append(falldownContainer, riseupContainer, actionButton);

  // Les deux musiques
  const winterAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  // ÉTAT DE LA MACHINE (0 = Noël, 1 = Printemps)
  let currentState = 0;

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();

    // --- MODE 1 : CLIC SUR NOËL (CHUTE DE NEIGE) ---
    if (currentState === 0) {
      winterAudio.currentTime = 0;
      winterAudio.play().catch(err => console.log("Audio bloqué :", err));

      actionButton.style.opacity = '0';
      actionButton.style.pointerEvents = 'none';

      // CIBLAGE ABSOLU : On prend TOUS les enfants directs, sans exception
      const elementsToDrop = Array.from(falldownContainer.children);

      elementsToDrop.forEach((el, index) => {
        el.style.display = 'block';
        el.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.5s';
        
        const rect = el.getBoundingClientRect();
        const targetY = window.innerHeight - rect.top - 40; 
        const randomX = (Math.random() - 0.5) * 150;
        const randomRotation = (Math.random() - 0.5) * 40;

        setTimeout(() => {
          el.style.transform = `translate(${randomX}px, ${targetY}px) rotate(${randomRotation}deg)`;
          el.style.opacity = '0';
        }, index * 100); // Cascade propre
      });

      // Fin de l'animation de chute (3,5 secondes)
      setTimeout(() => {
        winterAudio.pause(); // Coupe la musique direct

        // On bascule l'affichage vers le texte du Printemps
        falldownContainer.style.display = 'none';
        riseupContainer.style.display = 'block';
        
        // Petit hack pour forcer le navigateur à enregistrer le changement de display avant l'animation
        setTimeout(() => {
          riseupContainer.style.opacity = '1';
          riseupContainer.style.transform = 'translateY(0)';
          
          // On transforme le bouton pour le mode Zombie
          actionButton.textContent = 'Rise again... 🧟‍♂️🎃';
          actionButton.style.backgroundColor = '#3a5f0b';
          actionButton.style.color = '#fff';
          actionButton.style.opacity = '1';
          actionButton.style.pointerEvents = 'auto';
          
          currentState = 1; // On passe à l'état suivant
        }, 50);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3500);

    // --- MODE 2 : CLIC SUR ZOMBIE (RISE AGAIN) ---
    } else if (currentState === 1) {
      zombieAudio.currentTime = 0;
      zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

      // Le texte de printemps s'envole et disparaît vers le haut
      riseupContainer.style.transition = 'transform 2.5s ease-in, opacity 2s';
      riseupContainer.style.transform = 'translateY(-100vh)';
      riseupContainer.style.opacity = '0';
      
      actionButton.style.opacity = '0';
      actionButton.style.pointerEvents = 'none';

      // Fin de l'effet Zombie (3 secondes)
      setTimeout(() => {
        zombieAudio.pause();

        // Réinitialisation complète de Falldown (Noël revient)
        Array.from(falldownContainer.children).forEach((el) => {
          el.style.transition = 'none';
          el.style.transform = 'translate(0, 0) rotate(0deg)';
          el.style.opacity = '1';
        });

        riseupContainer.style.display = 'none';
        riseupContainer.style.transform = 'translateY(100px)'; // Reset position basse
        
        falldownContainer.style.display = 'block';
        falldownContainer.style.opacity = '1';

        // Reset du bouton en mode Noël
        actionButton.textContent = 'Make it snow! 🎄❄️';
        actionButton.style.backgroundColor = '';
        actionButton.style.color = '';
        actionButton.style.opacity = '1';
        actionButton.style.pointerEvents = 'auto';

        currentState = 0; // Retour à la case départ

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000);
    }
  });
}
