export default function decorate(block) {
  // 1. EXTRACTION SÉCURISÉE DU CONTENU
  const fullHTML = block.innerHTML;
  let falldownHTML = fullHTML;
  let riseupHTML = "<p>🌸 Bienvenue au printemps ! (Ajoutez --- dans votre document pour changer ce texte)</p>";

  if (fullHTML.includes('---')) {
    const parts = fullHTML.split('---');
    falldownHTML = parts[0];
    riseupHTML = parts[1];
  } else {
    riseupHTML = `<p>🌸 Surprise ! Le texte de Rise Up apparaît enfin à la place.</p>`;
  }

  // 2. VIDAGE ET RECONSTRUCTION EN FORCE
  block.innerHTML = '';

  // Conteneur Falldown (Noël)
  const falldownContainer = document.createElement('div');
  falldownContainer.className = 'falldown-zone';
  falldownContainer.innerHTML = falldownHTML;
  falldownContainer.style.display = 'block';
  falldownContainer.style.transition = 'opacity 0.5s';

  // Conteneur Riseup (Printemps)
  const riseupContainer = document.createElement('div');
  riseupContainer.className = 'riseup-zone';
  riseupContainer.innerHTML = riseupHTML;
  riseupContainer.style.opacity = '0';
  riseupContainer.style.transform = 'translateY(80px)';
  riseupContainer.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s';
  riseupContainer.style.display = 'none';

  // Le Bouton unique (Styles forcés en JS pour être sûr de le voir)
  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';
  actionButton.style.display = 'block';
  actionButton.style.margin = '40px auto'; // Marge plus grande pour l'isoler des textes
  actionButton.style.padding = '16px 32px';
  actionButton.style.fontSize = '20px';
  actionButton.style.fontWeight = 'bold';
  actionButton.style.cursor = 'pointer';
  actionButton.style.position = 'relative';
  actionButton.style.zIndex = '10000'; // Priorité d'affichage maximale
  actionButton.style.backgroundColor = '#0072ff';
  actionButton.style.color = '#fff';
  actionButton.style.border = 'none';
  actionButton.style.borderRadius = '30px';
  actionButton.style.transition = 'all 0.4s ease';

  // On injecte d'abord le bouton, puis les zones de texte pour qu'AEM ne le masque pas
  block.append(actionButton, falldownContainer, riseupContainer);

  const winterAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  let currentState = 0; // 0 = Noël, 1 = Zombie

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();

    // --- MODE 1 : CLIC SUR NOËL (CHUTE) ---
    if (currentState === 0) {
      winterAudio.currentTime = 0;
      winterAudio.play().catch(err => console.log("Audio bloqué :", err));

      actionButton.style.opacity = '0';
      actionButton.style.pointerEvents = 'none';

      const elementsToDrop = Array.from(falldownContainer.querySelectorAll('p, h1, h2, h3, li, img, span, strong, em'));
      const targets = elementsToDrop.length > 0 ? elementsToDrop : [falldownContainer];

      targets.forEach((el, index) => {
        el.style.transition = 'transform 3
