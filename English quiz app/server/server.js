const { json } = require("body-parser");
const { response } = require("express");
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

//Read json data
let rawData = fs.readFileSync("./TestData.json");
let data = JSON.parse(rawData);

//saving wordlist array
let wordsArr = data.wordList;

//saving scorelist array
let scoresList = data.scoresList;

//10 words arr
let tenWords;

//counter object for each part of speech
let counter = {noun: 0, verb: 0, adjective: 0, adverb:0};

//functon that returns 10 random words
function tenRandomWords(arrOfObjects) {

    //Randomizing rule
    let sorted = ([...arrOfObjects].sort(( () => 0.5 - Math.random())));

    //take first 10 words after randomization process
    tenWords = sorted.slice(0,10);

    //counting each part of speach in the random list of 10
    tenWords.forEach(function (obj) {
        if (obj.pos == "noun") {
            counter.noun++;
        }else if (obj.pos == "verb") {
            counter.verb++;
        }else if (obj.pos == "adjective") {
            counter.adjective++;
        }else if (obj.pos == "adverb") {
            counter.adverb++;
        }
    });
    console.log(tenWords);
    //another function to make sure each part of speech exists
    return oneOfEach(tenWords);
    
}

// function to keep one of each part of speech
function oneOfEach(words) {
    if (counter.noun === 0) {
        //Nouns only array
        let nounArr = wordsArr.filter((word) => {
            return word.pos === "noun";
        })

        words.pop();
        //push random word from nouns array to the 10 random words array
        let item = nounArr[Math.floor(Math.random()*nounArr.length)];
        words.push(item);
        return words;

    }
    else if (counter.verb === 0) {
        //Verbs only array
        let verbArr = wordsArr.filter((word) => {
        return word.pos === "verb";
    })
        //remove last word from the list
        words.pop();
        //push random word from verbs array to the 10 random words array
        let item = verbArr[Math.floor(Math.random()*verbArr.length)];
        words.push(item);
        return words;
    }
    else if (counter.adjective === 0) {
        //Adjectives only array
        let adjectiveArr = wordsArr.filter((word) => {
            return word.pos === "adjective";

    })
        //remove last word from the list
        words.pop();
        //push random word from adjective array to the 10 random words array
        let item = adjectiveArr[Math.floor(Math.random()*adjectiveArr.length)];
        words.push(item);
        return words;
    }
    else if (counter.adjective === 0) {
        //Adverbs only array
        let adverbArr = wordsArr.filter((word) => {
            return word.pos === "adverb";
        })

        //remove last word from the list
        words.pop();
        //push random word from adverb array to the 10 random words array
        let item = adverbArr[Math.floor(Math.random()*adverbArr.length)];
        words.push(item);
        return words;

} return tenWords;
}


//get request the 10 random words 
app.get("/words", cors(), (req, res) => {
    let newSet = tenRandomWords(wordsArr);
     res.json(newSet);
    
})
//get scoreList
app.get("/scoreList", cors(), (req, res) => {
     res.json(scoresList);
    
})

//start server
app.listen(5000, () => {
    console.log("server started on port 5000");
})