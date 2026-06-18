export default function decorate(block) {
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  
  // Musique de Noël féerique
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
  audio.loop = true;

  button.addEventListener('click', () => {
    audio.play().catch(err => console.log("Audio bloqué :", err));

    // Cibler TOUT le texte de la page sauf les blocs spéciaux
    const textNodes = document.querySelectorAll('p, h1, h2, h3, li, span');

    textNodes.forEach((node) => {
      if (node.closest('.falldown') || node.closest('.riseup') || node.tagName === 'BUTTON') return;

      const text = node.textContent;
      if (!text.trim()) return;

      const rect = node.getBoundingClientRect();
      const originalLeft = rect.left + window.scrollX;
      const originalTop = rect.top + window.scrollY;

      // Éviter que la page ne remonte d'un coup sec
      node.style.height = `${rect.height}px`;
      node.style.width = `${rect.width}px`;
      node.innerHTML = '';

      let currentLeftOffset = 0;
      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;

        // Styles de forçage absolu en ligne (plus fort que n'importe quel CSS)
        span.style.position = 'absolute';
        span.style.left = `${originalLeft + currentLeftOffset}px`;
        span.style.top = `${originalTop}px`;
        span.style.display = 'inline-block';
        span.style.zIndex = '99999';
        span.style.pointerEvents = 'none';
        // Vitesse et fluidité de la chute forcée ici :
        span.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 4s';

        document.body.appendChild(span);

        // Ajustement horizontal de la lettre
        currentLeftOffset += char === ' ' ? 8 : 11;

        // Déclenchement forcé de l'animation
        requestAnimationFrame(() => {
          setTimeout(() => {
            const randomX = (Math.random() - 0.5) * 250; 
            const randomRotation = (Math.random() - 0.5) * 500; 
            const targetY = window.innerHeight + window.scrollY - 50; 

            // Application directe de la chute
            span.style.transform = `translate(${randomX}px, ${targetY - originalTop}px) rotate(${randomRotation}deg)`;
            span.style.opacity = '0.1'; 
          }, 20);
        });
      });
    });
  });

  block.textContent = '';
  block.append(button);
}
