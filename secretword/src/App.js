//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//data
import { wordsList } from "./data/words";

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name); // Tela inicial
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0); // Inicializa a pontuação em 0

  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];

    // Pick a random word within the category
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates();

    // Pick word and category
    const { word, category } = pickWordAndCategory();

    // Create an array of letters
    let wordLetters = word.split("").map((l) => l.toLowerCase());

    // Fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Check if a letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) return;

    // Push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      // Reset all states
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Win condition
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // Add score
      setScore((actualScore) => actualScore + 100);

      // Restart game with a new word
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name); // Retorna à tela inicial
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
