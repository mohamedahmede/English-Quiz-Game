import React, { useEffect, useState } from "react";
import "./App.css";
import ProgressBar from "./components/progressBar";
//sounds
import correctAnswerSound from "./sounds/correctAnswer.mp3";
import wrongAnswerSound from "./sounds/buzz.wav";
import scoreboardSound from "./sounds/finalScore.mp3";

function App() {
  //USE STATES
  //data from server 10 words only
  const [data, setData] = useState([{}]);

  //scoreList data from server
  const [scoreListData, setScoreListData] = useState([{}]);

  //data is loaded or not
  const [isLoaded, setIsLoaded] = useState(false);

  //Start Screen
  const [startGame, setStartGame] = useState(false);

  //scoreboard after last question
  const [scoreboard, setScoreboard] = useState(false);

  //score
  const [score, setScore] = useState(0);

  //Correct Answers Counter
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(1);

  //people below your score
  const [belowScore, setBelowScore] = useState(0);

  //ProgressBar Counter
  const [progress, setProgress] = useState(10);

  //word counter
  const [wordCount, setWordCount] = useState(1);

  //Click handler
  const [noMoreClicks, setNoMoreClicks] = useState(false);

  //IF correct
  const [nextWord, setNextWord] = useState(true);

  ////////////////////
  const fetchWordData = async () => {
    const res = await fetch("http://localhost:5000/words");
    const json = await res.json();
    setData(json);
    setIsLoaded(true);
  };
  useEffect(() => {
    //fetching data from the server(TestData.jsSon file) and saving it in data useState
  
    fetchWordData();
  }, [isLoaded]);

  //fetch scorelist from server
    const fetchScoreData = async () => {
    const res = await fetch("http://localhost:5000/scoreList");
    const json = await res.json();
    setScoreListData(json);
    setIsLoaded(true);
  };
  useEffect(() => {
    //fetching data from the server(TestData.json file) and saving it in data useState
    
    if (isLoaded) {
      fetchScoreData();
    }
  }, [isLoaded]);

  //Functions
  function startGameFunc(x) {
    setStartGame(true);
  }

  //handling choice click
  function handleClick(e) {
    setNoMoreClicks(true);
    //make sure user choose only once answer at a time
    if (!noMoreClicks) {
      //converting buttons names to lowercase to prevent errors
      let choice = e.target.innerText.toLowerCase();

      //IF CORRECT ANSWER
      if (choice === data[wordCount - 1].pos) {
        let correctSound = new Audio(correctAnswerSound);
        correctSound.play();

        //counting correct answer
        setCorrectAnswerCounter(correctAnswerCounter + 1);

        //Setting Score after every question
        setScore((correctAnswerCounter / data.length) * 100);
        //adding css classes to add effect to buttons if correct
        e.currentTarget.classList.add("correctAnswer");

        if (nextWord && wordCount < 9) {
        }

        clearEffects();
      } else {
        //IF WRONG ANSWER
        //adding css classes to add effect to buttons if wrong
        let wrongSound = new Audio(wrongAnswerSound);
        wrongSound.play();
        e.currentTarget.classList.add("wrongAnswer");
        console.log("Wrong Answer ", data[wordCount - 1].pos);
        clearEffects();
      }
    } else {
      console.log("You already chose an answer");
    }
  }

  //move to next word and delete all classes
  function clearEffects() {
    setTimeout(function () {
      //selecting all choices and removing effect classes to prepare for next word
      const choices = document.querySelectorAll("li");
      choices.forEach((x) => {
        x.classList.remove("wrongAnswer");
        x.classList.remove("correctAnswer");
        x.classList.remove("blink");
        // setNextWord(true);
        if (nextWord && wordCount < 9) {
          setNoMoreClicks(false);
          setWordCount(wordCount + 1);

          //increase progressbar
          setProgress(((wordCount + 1) / data.length) * 100);
        } else {
          //increase progress bar
          setProgress(((wordCount + 1) / data.length) * 100);

          //filtering through score list to get people beneath current score
          let arr = [];
          scoreListData.filter((x) => {
            if (x < score) {
              arr.push(x);
            }
            return arr;
          });
          setBelowScore(arr);

          setWordCount(wordCount + 1);

          //show scoreboard
          setScoreboard(true);

          //Play congratulations sound
          let finishSound = new Audio(scoreboardSound);
          finishSound.play();

          console.log("failed to bring next word or reached the end");
        }
      });
    }, 3000);
  }

  //when try again button is clicked restart game
  function handleTryAgain() {
    setIsLoaded(false);
    setScore(0);
    setCorrectAnswerCounter(1);
    setBelowScore(0);
    setNoMoreClicks(false);
    setNextWord(true);
    setWordCount(1);
    setProgress(10);
    setScoreboard(false);
    setStartGame(false);
  }

  return (
    <div>
      {/* {Start Game only when data is ready} */}
      {!isLoaded ? (
        <div>Loading</div>
      ) : (
        <div>
          {/* {0. if Game hasnot started start on click} */}

          {!startGame ? (
            <div className="questionCard startGame">
              <h1>English Quiz Game</h1>
              <p>
                The quiz is about part of speech. You are going to get a random
                word, for each word you have to choose it's correct part of
                speech
              </p>
              <button onClick={startGameFunc} className={"startGameBtn"}>
                Start Game
              </button>
            </div>
          ) : (
            <div>
              {console.log(data)}

              {/* {1. Header} */}
              <h1>English Quiz Game</h1>

              {/* {2. Current Score} */}
              <h2>Current Score: {score}</h2>

              {/*Progress Bar*/}
              <ProgressBar done={progress} />

              {scoreboard ? (
                /* {4. Scoreboard} */
                
                <div className="score">
                  
                  <h1 className="scoreboardHeader">Your Rank: </h1>
                  {/* {Ranking Calculation (below your score / Amount of scores) * 100} */}
                  <h2>{Math.round(100*(belowScore.length / scoreListData.length) * 100)/100}</h2>

                  <button className="tryAgain"  onClick={handleTryAgain}>Try Again</button>
                </div>
              ) : (
                /* {3. Question Card} */
                <div className="questionCard">
                  <h3>
                    Word {wordCount} out {data.length}
                  </h3>

                  <h2 key={data[wordCount - 1].id} className={"word"}>
                    "{data[wordCount - 1].word}"
                  </h2>

                  <ul>
                    <li onClick={handleClick}>Noun</li>
                    <li onClick={handleClick}>Verb</li>
                    <li onClick={handleClick}>Adjective</li>
                    <li onClick={handleClick}>Adverb</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
