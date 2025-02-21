import { useImmer } from "use-immer";
import { v4 as uuidv4 } from "uuid";
import React, { useCallback } from "react";
import { useState, useEffect, useRef } from "react";
import Card from "./Card";
import Popup from "./Popup";
import styles from "../styles/game.module.css";

export default function Game() {
  const cardsAmount = 10;
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(score);
  const [isLoading, setIsLoading] = useState(false);

  const [cards, setCards] = useImmer([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const refs = useRef({});

  const fetchPokemons = useCallback(
    async (data) => {
      console.log(data);
      await data.results.forEach((p) => {
        fetch(p.url)
          .then((response) => response.json())
          .then((pokemon) => {
            const name = pokemon.name;
            const img =
              pokemon.sprites.versions[`generation-v`][`black-white`].animated
                .front_default;
            setCards((draft) => {
              draft.push({
                name: name,
                image: img,
                id: uuidv4(),
                isChecked: false,
              });
            });
          });
      });
    },
    [setCards]
  );

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    async function fetchData() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${cardsAmount}`
        );
        if (!ignore) {
          if (response.ok) {
            const json = await response.json();
            fetchPokemons(json);
            setIsLoading(false);
          } else {
            throw new Error(response.status);
          }
        }
      } catch (error) {
        return error;
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [fetchPokemons]);

  function gameHandler(item, index) {
    if (item.isChecked) {
      //Game OVer
      setShowPopup(true);
      updateBestScore();
    } else {
      //Next round
      setCards((draft) => {
        draft[index].isChecked = true;
      });
      nextRound();
    }
    refs[item.name].current.blur();
  }

  function nextRound() {
    setScore((score) => score + 1);
    setCards((draft) => {
      //draft.sort(() => 0.5 - Math.random());
      shuffleArray(draft);
    });
  }

  function updateBestScore(){
    if (score > bestScore) {
      setBestScore(score);
    }
  }

 const checkWin = () => {
    console.log(`Cards Amount: ${cardsAmount}, Score: ${score}`);
    if(score === cardsAmount){
      console.log("Win")
      setIsWin(true);
      setShowPopup(true);
      updateBestScore();
    }
  }

  useEffect(() => checkWin(), [score]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  function restartGame() {
    nextRound();
    setScore(0);
    setCards((draft) => {
      draft.forEach((d) => {
        d.isChecked = false;
      });
    });
    setShowPopup(false);
    setIsWin(false);
  }

  //const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  return (
    <section id={styles.game}>
      <Popup
        onClick={() => restartGame()}
        score={score}
        isVisible={showPopup}
        isWin={isWin}
      />
      <section id={styles.main}>
        <div>
          <p>Score: {score}</p>
          <p>Best Score: {bestScore}</p>
          {isLoading && <h2>Gathering Pokemons...</h2>}
          <div className={styles.cards}>
            {cards.map((item, index) => {
              //await timer(100);
              const newRef = React.createRef();
              refs[item.name] = newRef;
              return (
                <Card
                  name={item.name}
                  image={item.image}
                  key={item.id}
                  ref={newRef}
                  onClick={() => gameHandler(item, index)}
                />
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}
