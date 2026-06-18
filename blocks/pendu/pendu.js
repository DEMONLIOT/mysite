export default function decorate(block) {
  // Liste de mots 100% Adobe, connus de tous et faciles
  const WORDS = ['PHOTOSHOP', 'PDF', 'ILLUSTRATOR', 'ADOBE', 'CLOUD', 'AEM', 'DESIGN', 'ACROBAT', 'PREMIERE'];
  
  let chosenWord = '';
  let guessedLetters = [];
  let mistakes = 0;
  const maxMistakes = 6;

  // Les étapes du pendu en dessin textuel (Art ASCII)
  const HANGMAN_STAGES = [
    `\n\n\n\n\n=========`,
    `\n  |\n  |\n  |\n  |\n=========`,
    `  +---+\n  |\n  |\n  |\n  |\n=========`,
    `  +---+\n  |   O\n  |\n  |\n  |\n=========`,
    `  +---+\n  |   O\n  |   |\n  |\n  |\n=========`,
    `  +---+\n  |   O\n  |  /|\\\n  |\n  |\n=========`,
    `  +---+\n  |   O\n  |  /|\\\n  |  / \\\n  |\n=========`
  ];

  // 1. CRÉATION DE L'INTERFACE HTML
  block.innerHTML = '';
  block.classList.add('pendu-container');

  const title = document.createElement('h2');
  title.textContent = '🎨 Le Pendu Spécial Adobe 🔴';

  const asciiDisplay = document.createElement('pre');
  asciiDisplay.className = 'pendu-ascii';

  const wordDisplay = document.createElement('div');
  wordDisplay.className = 'pendu-word';

  const messageDisplay = document.createElement('div');
  messageDisplay.className = 'pendu-message';

  const keyboardContainer = document.createElement('div');
  keyboardContainer.className = 'pendu-keyboard';

  const resetButton = document.createElement('button');
  resetButton.className = 'pendu-reset';
  resetButton.textContent = 'Trouver un autre mot 🔄';
  resetButton.style.display = 'none';

  block.append(title, asciiDisplay, wordDisplay, messageDisplay, keyboardContainer, resetButton);

  // 2. LOGIQUE DU JEU
  function initGame() {
    chosenWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    guessedLetters = [];
    mistakes = 0;
    messageDisplay.textContent = '';
    messageDisplay.className = 'pendu-message';
    resetButton.style.display = 'none';
    
    updateDisplay();
    buildKeyboard();
  }

  function updateDisplay() {
    asciiDisplay.textContent = HANGMAN_STAGES[mistakes];

    // Affichage du mot masqué
    const displayStr = chosenWord
      .split('')
      .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
      .join(' ');
    wordDisplay.textContent = displayStr;

    // Victoire
    if (!displayStr.includes('_')) {
      messageDisplay.textContent = '🎉 Bravo ! Tu connais bien tes classiques Adobe !';
      messageDisplay.className = 'pendu-message win';
      disableKeyboard();
      resetButton.style.display = 'block';
    }

    // Défaite
    if (mistakes >= maxMistakes) {
      messageDisplay.textContent = `💀 Dommage... Le mot Adobe était : ${chosenWord}`;
      messageDisplay.className = 'pendu-message lose';
      disableKeyboard();
      resetButton.style.display = 'block';
    }
  }

  function buildKeyboard() {
    keyboardContainer.innerHTML = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    alphabet.split('').forEach(letter => {
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.className = 'letter-btn';
      
      btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.classList.add('used');
        
        if (chosenWord.includes(letter)) {
          guessedLetters.push(letter);
        } else {
          mistakes++;
        }
        updateDisplay();
      });

      keyboardContainer.appendChild(btn);
    });
  }

  function disableKeyboard() {
    const buttons = keyboardContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
  }

  resetButton.addEventListener('click', initGame);

  initGame();
}
