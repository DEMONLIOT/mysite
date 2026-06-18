export default function decorate(block) {
  // 1. EXTRACTION DU CONTENU SÉCURISÉE
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

  // 2. NETTOYAGE ET STRUCTURATION
  block.innerHTML = '';

  const falldownContainer = document.createElement('div');
  falldownContainer.className = 'falldown-zone';
  falldownContainer.innerHTML = falldownHTML;
  falldownContainer.style.display = 'block';
  falldownContainer.style.transition = 'opacity 0.5s';

  const riseupContainer = document.createElement('div');
  riseupContainer.className = 'riseup-zone';
  riseupContainer.innerHTML = riseupHTML;
  riseupContainer.style.opacity = '0';
  riseupContainer.style.transform = 'translateY(80px)';
  riseupContainer.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s';
  riseupContainer.style.display = 'none';

  // 3. LE BOUTON FLOUTTANT (Impossible à cacher par AEM)
  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';
  
  // Styles CSS fixes pour le forcer à flotter en bas de l'écran
  actionButton.style.position = 'fixed';
  actionButton.style.bottom = '30px';
  actionButton.style.left = '50%';
  actionButton.style.transform = 'translateX(-50%)';
  actionButton.style.zIndex = '999999'; // Priorité absolue sur toute la page
  actionButton.style.padding = '16px 32px';
  actionButton.style.fontSize = '20px';
  actionButton.style.fontWeight = 'bold';
  actionButton.style.cursor = 'pointer';
  actionButton.style.backgroundColor = '#0072ff';
  actionButton.style.color = '#fff';
  actionButton.style.border = 'none';
  actionButton.style.borderRadius = '30px';
  actionButton.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
  actionButton.style.transition = 'all 0.4s ease';

  // Ajout au document
  block.append(falldownContainer, riseupContainer);
  document.body.appendChild(actionButton); // Injecté directement dans le body pour contourner AEM !

  const winterAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  let currentState = 0;

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (currentState === 0) {
      winterAudio.currentTime = 0;
      winterAudio.play().catch(err => console.log("Audio bloqué :", err));

      actionButton.style.opacity = '0';
      actionButton.style.pointerEvents = 'none';

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
          el.style.opacity
