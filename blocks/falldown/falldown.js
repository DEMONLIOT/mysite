// Cette fonction va s'exécuter de force, même si le header/footer ont crashé la page
function initFalldownForced(block) {
  // Évite d'ajouter le bouton plusieurs fois
  if (block.querySelector('button')) return;

  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  
  // Style du bouton injecté en direct pour être sûr qu'il soit beau
  button.style.padding = '12px 24px';
  button.style.fontSize = '18px';
  button.style.backgroundColor = '#0072ff';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '25px';
  button.style.cursor = 'pointer';

  // Musique féerique de Noël
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  audio.loop = true;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    audio.play().catch(err => console.log("Audio bloqué par le navigateur, réessaye de cliquer :", err));

    // On cible le texte
    const textNodes = document.querySelectorAll('p, h1, h2, h3, li, span');

    textNodes.forEach((node) => {
      if (node.closest('.falldown') || node.closest('.riseup') || node.tagName === 'BUTTON') return;

      const text = node.textContent;
      if (!text.trim()) return;

      const rect = node.getBoundingClientRect();
      const originalLeft = rect.left + window.scrollX;
      const originalTop = rect.top + window.scrollY;

      node.style.height = `${rect.height}px`;
      node.style.width = `${rect.width}px`;
      node.innerHTML = '';

      let currentLeftOffset = 0;
      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;

        span.style.position = 'absolute';
        span.style.left = `${originalLeft + currentLeftOffset}px`;
        span.style.top = `${originalTop}px`;
        span.style.display = 'inline-block';
        span.style.zIndex = '99999';
        span.style.pointerEvents = 'none';
        span.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 4s';

        document.body.appendChild(span);

        currentLeftOffset += char === ' ' ? 8 : 11;

        setTimeout(() => {
          const randomX = (Math.random() - 0.5) * 250; 
          const randomRotation = (Math.random() - 0.5) * 500; 
          const targetY = window.innerHeight + window.scrollY - 50; 

          span.style.transform = `translate(${randomX}px, ${targetY - originalTop}px) rotate(${randomRotation}deg)`;
          span.style.opacity = '0.1'; 
        }, 50);
      });
    });
  });

  block.textContent = '';
  block.append(button);
}

// Décorateur standard AEM
export default function decorate(block) {
  initFalldownForced(block);
}

// SÉCURITÉ CRITIQUE : Si AEM a planté à cause du header, on force quand même le chargement du bouton au bout d'une seconde !
setTimeout(() => {
  const falldownBlock = document.querySelector('.falldown');
  if (falldownBlock) {
    initFalldownForced(falldownBlock);
  }
}, 1000);
