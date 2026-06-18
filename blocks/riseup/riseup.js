export default function decorate(block) {
  // On garde le contenu initial
  const contentContainer = document.createElement('div');
  contentContainer.className = 'riseup-content';
  contentContainer.innerHTML = block.innerHTML;

  // Masqué au départ (en bas)
  block.style.opacity = '0';
  block.style.transform = 'translateY(60px)';
  block.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s';

  // Création du bouton Zombie
  const zombieButton = document.createElement('button');
  zombieButton.textContent = 'Rise again... 🧟‍♂️🎃';
  zombieButton.style.display = 'block';
  zombieButton.style.margin = '20px auto';
  zombieButton.style.padding = '12px 24px';
  zombieButton.style.backgroundColor = '#3a5f0b'; // Vert zombie
  zombieButton.style.color = '#fff';
  zombieButton.style.border = '2px solid #1a2f05';
  zombieButton.style.borderRadius = '5px';
  zombieButton.style.cursor = 'pointer';
  zombieButton.style.fontFamily = 'monospace';

  block.innerHTML = '';
  block.append(contentContainer, zombieButton);

  // Musique de zombie / sinistre (un son d'ambiance sombre)
  const zombieAudio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'); // Une piste plus sombre/rock

  // Écouter le signal de fin du premier bloc (Falldown)
  document.addEventListener('textHasFallen', () => {
    block.style.opacity = '1';
    block.style.transform = 'translateY(0)';
  });

  // Clic sur le bouton Zombie
  zombieButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Lancer la musique sinistre
    zombieAudio.currentTime = 0;
    zombieAudio.play().catch(err => console.log("Audio bloqué :", err));

    // Faire disparaître le texte et le bouton en les faisant MONTER vers le haut
    block.style.transition = 'transform 2.5s ease-in, opacity 2s';
    block.style.transform = 'translateY(-100vh)'; // Monte au-dessus de l'écran
    block.style.opacity = '0';

    // Attendre la fin de l'animation pour couper le son et réveiller Falldown
    setTimeout(() => {
      // Coupe le son proprement
      const fadeAudio = setInterval(() => {
        if (zombieAudio.volume > 0.1) {
          zombieAudio.volume -= 0.1;
        } else {
          clearInterval(fadeAudio);
          zombieAudio.pause();
          zombieAudio.volume = 1.0;
        }
      }, 50);

      // Envoyer le signal de résurrection au bloc Falldown
      document.dispatchEvent(new CustomEvent('zombieRiseAgain'));
      
      // Remettre le bloc en position initiale cachée en bas pour le prochain tour
      setTimeout(() => {
        block.style.transition = 'none';
        block.style.transform = 'translateY(60px)';
      }, 500);

    }, 3000);
  });
}
