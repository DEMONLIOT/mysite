export default function decorate(block) {
  // 1. On récupère le texte qui est écrit dans le bloc (depuis Word/Google Docs)
  const originalText = block.textContent.trim() || "Texte par défaut à faire tomber";
  
  block.innerHTML = ''; // On vide le bloc pour y mettre notre structure propre

  // 2. On crée un conteneur pour le texte initial afin qu'il soit bien visible au début
  const textContainer = document.createElement('div');
  textContainer.className = 'falldown-text-target';
  textContainer.style.fontSize = '20px';
  textContainer.style.marginBottom = '20px';
  textContainer.style.textAlign = 'center';
  textContainer.style.lineHeight = '1.6';
  textContainer.textContent = originalText;

  // 3. On crée le bouton de Noël
  const button = document.createElement('button');
  button.textContent = 'Make it snow! 🎄❄️';
  
  block.append(textContainer, button);

  // Musique de Noël (Jingle Bells instrumental)
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');

  // 4. L'événement au clic
  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Lancer la musique
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio bloqué :", err));

    // Récupérer la position exacte du bloc de texte
    const rect = textContainer.getBoundingClientRect();
    const originalLeft = rect.left + window.scrollX;
    const originalTop = rect.top + window.scrollY;

    // Figer la hauteur pour éviter que le bouton ne remonte brusquement
    textContainer.style.height = `${rect.height}px`;
    textContainer.style.width = `${rect.width}px`;
    textContainer.innerHTML = ''; // On vide le texte brut

    let currentLeftOffset = 0;

    // Découper le texte en lettres volantes
    [...originalText].forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;

      // Position de départ exacte (le texte reste immobile au début)
      span.style.position = 'absolute';
      span.style.left = `${originalLeft + currentLeftOffset}px`;
      span.style.top = `${originalTop}px`;
      span.style.display = 'inline-block';
      span.style.zIndex = '99999';
      span.style.pointerEvents = 'none';
      span.style.fontSize = '20px';
      span.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 4s';

      document.body.appendChild(span);
      currentLeftOffset += char === ' ' ? 8 : 12;

      // Lancer la chute de la lettre
      setTimeout(() => {
        const randomX = (Math.random() - 0.5) * 200;
        const randomRotation = (Math.random() - 0.5) * 720;
        const targetY = window.innerHeight + window.scrollY - 40;

        span.style.transform = `translate(${randomX}px, ${targetY - originalTop}px) rotate(${randomRotation}deg)`;
        span.style.opacity = '0'; // Disparaît en touchant le sol
      }, 50);

      // Supprimer la lettre du code après l'animation
      setTimeout(() => { span.remove(); }, 4000);
    });

    // Cacher le bouton après le clic pour laisser place nette
    button.style.transition = 'opacity 1s';
    button.style.opacity = '0';
    setTimeout(() => { button.remove(); }, 1000);

    // Arrêter la musique et déclencher Riseup après 4 secondes
    setTimeout(() => {
      const fadeAudio = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          audio.pause();
          audio.volume = 1.0;
        }
      }, 50);

      // Envoyer le signal à Riseup
      document.dispatchEvent(new CustomEvent('textHasFallen'));
    }, 4000);
  });
}
