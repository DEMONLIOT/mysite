export default function decorate(block) {
  // 1. EXTRACTION SÉCURISÉE DU CONTENU
  // On récupère tous les éléments HTML générés par AEM à l'intérieur du bloc
  const rawElements = Array.from(block.querySelectorAll(':scope > div > div, :scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > div'));
  
  // On nettoie la liste pour enlever les conteneurs vides
  const cleanElements = rawElements.filter(el => el.textContent.trim().length > 0 && !el.querySelector('button'));

  let falldownHTML = "";
  let riseupHTML = "";

  // Si AEM nous donne plusieurs lignes/éléments
  if (cleanElements.length >= 2) {
    // Le premier élément (ex: "Introduction") va dans la chute
    falldownHTML = cleanElements[0].innerHTML;
    // Tout le reste (la suite du texte ET le texte de riseup) est réparti
    // Pour être sûr de voir la suite, on fusionne les éléments restants dans Riseup
    riseupHTML = cleanElements.slice(1).map(el => el.innerHTML).join('<br><br>');
  } else {
    // Cas de secours si tout est collé ensemble
    falldownHTML = block.innerHTML;
    riseupHTML = "<p>🌸 Bienvenue au printemps ! (Ajoutez une deuxième ligne dans votre tableau AEM pour changer ce texte)</p>";
  }

  // 2. RECONSTRUCTION DE LA STRUCTURE
  block.innerHTML = ''; // On vide pour nettoyer les résidus d'AEM

  // Zone Falldown (Noël)
  const falldownContainer = document.createElement('div');
  falldownContainer.className = 'falldown-zone';
  falldownContainer.innerHTML = falldownHTML;
  falldownContainer.style.transition = 'opacity 0.5s';

  // Zone Riseup (Printemps + Suite du texte)
  const riseupContainer = document.createElement('div');
  riseupContainer.className = 'riseup-zone';
  riseupContainer.innerHTML = riseupHTML;
  riseupContainer.style.opacity = '0';
  riseupContainer.style.transform = 'translateY(100px)';
  riseupContainer.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';
  riseupContainer.style.display = 'none'; // Caché au début

  // Le Bouton d'action unique
  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';
  actionButton.style.display = 'block';
  actionButton.style.margin = '30px auto';
  actionButton.style.padding = '14px 28px';
  actionButton.style.fontSize = '18px';
  actionButton.style.cursor = 'pointer';
  actionButton.style.position = 'relative';
  actionButton.style.zIndex = '1000';
  actionButton.style.transition = 'all 0.5s';

  block.append(falldownContainer, riseupContainer, actionButton);

  const winterAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  let currentState = 0; // 0 = Noël, 1 = Zombie

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();

    // --- MODE 1 : CLIC SUR NOËL ---
    if (currentState === 0) {
      winterAudio.currentTime = 0;
      winterAudio.play().catch(err => console.log("Audio bloqué :", err));

      actionButton.style.opacity = '0';
      actionButton.style.pointerEvents = 'none';

      // On fait tomber absolument tous les enfants visibles de la zone Noël
      const elementsToDrop = Array.from(falldownContainer.querySelectorAll('p, h1, h2, h3, li, img, span, strong'));
      
      // Si aucun enfant précis, on prend le bloc entier
      const targets = elementsToDrop.length > 0 ? elementsToDrop : [falldownContainer];

      targets.forEach((el, index) => {
        el.style.transition = 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.5s';
        
        const rect = el.getBoundingClientRect();
        const targetY = window.innerHeight - rect.top - 40; 
        const randomX = (Math.random() - 0.5) * 150;
        const randomRotation = (Math.random() - 0.5) * 40;

        setTimeout(() => {
          el.style.transform = `translate(${randomX}px, ${targetY}px) rotate(${randomRotation}deg)`;
          el.style.opacity = '0';
        }, index * 50);
      });

      // Transition vers l'état Printemps / Suite
      setTimeout(() => {
        winterAudio.pause();

        falldownContainer.style.display = 'none';
        riseupContainer.style.display = 'block';
        
        setTimeout(() => {
          riseupContainer.style.opacity = '1';
          riseupContainer.style.transform = 'translateY(0)';
          
          // Métamorphose du bouton
          actionButton.textContent = 'Rise again... 🧟‍♂️🎃';
          actionButton.style.backgroundColor = '#3a5f0b';
          actionButton.style.color = '#fff';
          actionButton.style.opacity = '1';
          actionButton.style.pointerEvents = 'auto';
          
          currentState = 1;
        }, 50);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3500);

    // --- MODE 2 : CLIC SUR ZOMBIE ---
    } else if (currentState === 1) {
      zombieAudio.currentTime = 0;
      zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

      riseupContainer.style.transition = 'transform 2.5s ease-in, opacity 2s';
      riseupContainer.style.transform = 'translateY(-100vh)';
      riseupContainer.style.opacity = '0';
      
      actionButton.style.opacity = '0';
      actionButton.style.pointerEvents = 'none';

      setTimeout(() => {
        zombieAudio.pause();

        // Réinitialiser la zone de Noël
        const targets = elementsToDrop.length > 0 ? elementsToDrop : [falldownContainer];
        targets.forEach((el) => {
          el.style.transition = 'none';
          el.style.transform = 'translate(0, 0) rotate(0deg)';
          el.style.opacity = '1';
        });

        riseupContainer.style.display = 'none';
        riseupContainer.style.transform = 'translateY(100px)';
        
        falldownContainer.style.display = 'block';
        falldownContainer.style.opacity = '1';

        // Bouton revient en mode Noël
        actionButton.textContent = 'Make it snow! 🎄❄️';
        actionButton.style.backgroundColor = '';
        actionButton.style.color = '';
        actionButton.style.opacity = '1';
        actionButton.style.pointerEvents = 'auto';

        currentState = 0;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000);
    }
  });
}
