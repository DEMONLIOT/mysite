export default function decorate(block) {
  // 1. EXTRACTION BRUTE SANS DECOUPAGE D'AEM
  // On récupère tout le texte/HTML du bloc pour éviter qu'AEM ne casse tout
  const fullHTML = block.innerHTML;

  // On cherche notre séparateur secret. Si tu ne le mets pas, on coupe à la moitié.
  let falldownHTML = fullHTML;
  let riseupHTML = "<p>🌸 Bienvenue au printemps ! (Ajoutez --- dans votre document pour changer ce texte)</p>";

  if (fullHTML.includes('---')) {
    const parts = fullHTML.split('---');
    falldownHTML = parts[0];
    riseupHTML = parts[1];
  } else {
    // Si pas de séparateur, on duplique pour éviter le bug du texte vide
    riseupHTML = `<p>🌸 Surprise ! Le texte de Rise Up apparaît enfin à la place.</p>`;
  }

  // 2. RECONSTRUCTION PROPRE DE LA PAGE
  block.innerHTML = ''; // On vide les div instables d'AEM

  // Conteneur Falldown (Tout le texte du début, images comprises)
  const falldownContainer = document.createElement('div');
  falldownContainer.className = 'falldown-zone';
  falldownContainer.innerHTML = falldownHTML;
  falldownContainer.style.display = 'block';
  falldownContainer.style.transition = 'opacity 0.5s';

  // Conteneur Riseup (Le texte secret du printemps)
  const riseupContainer = document.createElement('div');
  riseupContainer.className = 'riseup-zone';
  riseupContainer.innerHTML = riseupHTML;
  riseupContainer.style.opacity = '0';
  riseupContainer.style.transform = 'translateY(80px)';
  riseupContainer.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s';
  riseupContainer.style.display = 'none'; // Caché au début

  // Le Bouton unique
  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';
  actionButton.style.display = 'block';
  actionButton.style.margin = '30px auto';
  actionButton.style.padding = '14px 28px';
  actionButton.style.fontSize = '18px';
  actionButton.style.cursor = 'pointer';
  actionButton.style.position = 'relative';
  actionButton.style.zIndex = '1000';
  actionButton.style.transition = 'all 0.4s';

  block.append(falldownContainer, riseupContainer, actionButton);

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

      // On attrape absolument TOUTES les balises de texte/image de la zone Noël
      const elementsToDrop = Array.from(falldownContainer.querySelectorAll('p, h1, h2, h3, li, img, span, strong, em'));
      const targets = elementsToDrop.length > 0 ? elementsToDrop : [falldownContainer];

      targets.forEach((el, index) => {
        el.style.transition = 'transform 3.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 3.2s';
        
        const rect = el.getBoundingClientRect();
        const targetY = window.innerHeight - rect.top - 40; 
        const randomX = (Math.random() - 0.5) * 160;
        const randomRotation = (Math.random() - 0.5) * 50;

        setTimeout(() => {
          el.style.transform = `translate(${randomX}px, ${targetY}px) rotate(${randomRotation}deg)`;
          el.style.opacity = '0';
        }, index * 40); // Cascade fluide
      });

      // Transition vers le Printemps
      setTimeout(() => {
        winterAudio.pause();

        falldownContainer.style.display = 'none';
        riseupContainer.style.display = 'block';
        
        setTimeout(() => {
          riseupContainer.style.opacity = '1';
          riseupContainer.style.transform = 'translateY(0)';
          
          // Transformation du bouton
          actionButton.textContent = 'Rise again... 🧟‍♂️🎃';
          actionButton.style.backgroundColor = '#3a5f0b';
          actionButton.style.color = '#fff';
          actionButton.style.opacity = '1';
