import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
const API_URL = "https://random-word-api.herokuapp.com/word?number=10&length=5";
const WORD_LENGTH = 5;
function Line({ guess }) {
  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    tiles.push(
      <div key={i} className="tile">
        {char}
      </div>
    );
  }
  return <div className="line">{tiles}</div>;
}

function App() {
  const [randWord, setRandWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currGuess, setCurrGuess] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: API_URL,
      };
      try {
        const { data } = await axios.request(options);
        console.log(data);
        const word = data[Math.floor(Math.random() * data.length)];
        setRandWord(word);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.keyCode === 13) {
        if (currGuess.length !== WORD_LENGTH) return;
        const newGuesses = [...guesses];
        const index = guesses.findIndex((val) => val == null);
        newGuesses[index] = currGuess;
        setGuesses(newGuesses);
        setCurrGuess("");
      } else if (event.keyCode === 8) {
        setCurrGuess((currGuess) => currGuess.slice(0, -1));
      } else if (event.keyCode > 64 && event.keyCode < 91) {
        //WORD_LENGTH
        setCurrGuess((prevGuess) => {
          if (prevGuess.length < WORD_LENGTH) return prevGuess + event.key;
          else return prevGuess;
        });
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currGuess]);

  return (
    <div className="App">
      <h1>{randWord}</h1>
      {guesses.map((guess, index) => {
        const iscurrentGuess =
          index === guesses.findIndex((val) => val == null);
        return (
          <Line key={index} guess={iscurrentGuess ? currGuess : guess ?? ""} />
        );
      })}
      <h3>{currGuess}</h3>
    </div>
  );
}

export default App;
