export default function decorate(block) {
  // 1. EXTRACTION DU CONTENU ET NETTOYAGE DES BALISES DU SÉPARATEUR
  let fullHTML = block.innerHTML;

  // Sécurité : on remplace les variantes possibles du séparateur (ex: <p>---</p>) par un '---' brut
  fullHTML = fullHTML.replace(/<p[^>]*>\s*---\s*<\/p>/g, '---');
  fullHTML = fullHTML.replace(/<div[^>]*>\s*---\s*<\/div>/g, '---');

  let falldownHTML = fullHTML;
  let riseupHTML = "<p>🌸 Bienvenue au printemps ! (Ajoutez --- dans votre document pour changer ce texte)</p>";

  // Découpage propre entre Noël et ton texte Riseup
  if (fullHTML.includes('---')) {
    const parts = fullHTML.split('---');
    falldownHTML = parts[0];
    riseupHTML = parts[1];
  }

  // 2. RECONSTRUCTION
  block.innerHTML = '';

  const falldownContainer = document.createElement('div');
  falldownContainer.className = 'falldown-zone';
  falldownContainer.innerHTML = falldownHTML;

  const riseupContainer = document.createElement('div');
  riseupContainer.className = 'riseup-zone';
  riseupContainer.innerHTML = riseupHTML;
  riseupContainer.style.opacity = '0';
  riseupContainer.style.transform = 'translateY(80px)';
  riseupContainer.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.8s';
  riseupContainer.style.display = 'none';

  const actionButton = document.createElement('button');
  actionButton.textContent = 'Make it snow! 🎄❄️';

  block.append(falldownContainer, riseupContainer, actionButton);

  const winterAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');

  let currentState = 0;

  actionButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (currentState === 0) {
      winterAudio.currentTime = 0;
      winterAudio.play().catch(err => console.log("Audio bloqué :", err));

      actionButton.style.setProperty('opacity', '0', 'important');
      actionButton.style.setProperty('pointer-events', 'none', 'important');

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
        }, index * 40);
      });

      setTimeout(() => {
        winterAudio.pause();

        falldownContainer.style.display = 'none';
        riseupContainer.style.display = 'block';
        
        setTimeout(() => {
          riseupContainer.style.opacity = '1';
          riseupContainer.style.transform = 'translateY(0)';
          
          actionButton.textContent = 'Rise again... 🧟‍♂️🎃';
          actionButton.style.setProperty('background-color', '#3a5f0b', 'important');
          actionButton.style.setProperty('opacity', '1', 'important');
          actionButton.style.setProperty('pointer-events', 'auto', 'important');
          
          currentState = 1;
        }, 50);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3200);

    } else if (currentState === 1) {
      zombieAudio.currentTime = 0;
      zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

      riseupContainer.style.transition = 'transform 2.2s ease-in, opacity 1.8s';
      riseupContainer.style.transform = 'translateY(-100vh)';
      riseupContainer.style.opacity = '0';
      
      actionButton.style.setProperty('opacity', '0', 'important');
      actionButton.style.setProperty('pointer-events', 'none', 'important');

      setTimeout(() => {
        zombieAudio.pause();

        const elementsToDrop = Array.from(falldownContainer.querySelectorAll('p, h1, h2, h3, li, img, span, strong, em'));
        const targets = elementsToDrop.length > 0 ? elementsToDrop : [falldownContainer];
        
        targets.forEach((el) => {
          el.style.transition = 'none';
          el.style.transform = 'translate(0, 0) rotate(0deg)';
          el.style.opacity = '1';
        });

        riseupContainer.style.display = 'none';
        riseupContainer.style.transform = 'translateY(80px)';
        
        falldownContainer.style.display = 'block';
        falldownContainer.style.opacity = '1';

        actionButton.textContent = 'Make it snow! 🎄❄️';
        actionButton.style.setProperty('background-color', '#0072ff', 'important');
        actionButton.style.setProperty('opacity', '1', 'important');
        actionButton.style.setProperty('pointer-events', 'auto', 'important');

        currentState = 0;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2500);
    }
  });
}
