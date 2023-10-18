import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

const getWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const inCorrectLetters = guessedLetters.filter((guessedLetter) => {
    return !wordToGuess.includes(guessedLetter);
  });

  const isLoser = inCorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) {
        return;
      }
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isLoser, isWinner]
  );

  // const addGuessedLetter = (key: string) => {
  //   // This always prints an empty array of guessedLetters
  //   //console.log(guessedLetters);
  //   if (guessedLetters.includes(key)) {
  //     return;
  //   }
  //   setGuessedLetters((currentLetters) => [...currentLetters, key]);
  // };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) {
        return;
      }

      e.preventDefault();
      addGuessedLetter(key);
    };

    // This forms a closure where we have addGuessedLetter function inside our
    // closure now everytime keypress event occurs handler function is called and
    // it references the same addGuessedLetter function for which guessedLetters is
    // still an empty array becaused guessedLetters also became a part of that closure
    // And as we run this callback function for useEffect only on the componentDidMount
    // it is not aware of the latest state of guessedLetters
    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice try!"}
      </div>
      <HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          addGuessedLetter={addGuessedLetter}
          activeLetters={guessedLetters.filter((letter) => {
            return wordToGuess.includes(letter);
          })}
          inactiveLetters={inCorrectLetters}
        />
      </div>
    </div>
  );
}

export default App;
