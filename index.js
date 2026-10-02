import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let vocabulary = "";
let correctAnswer = null;
let userAnswer = null;
let word = null;

const webSource = "https://www.dwds.de/api/lemma/goethe/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// page: select the vocabulary
app.get("/", async (req, res) => {
    // set the variables to 0 
    vocabulary = null;
    correctAnswer = null;
    userAnswer = null;
    word = null;

    res.render("index.ejs", {
        page: "intro"
    })
});

// show instructions - get choosen vocabulary
app.post("/instructions", async (req, res) => {
    // get users vocabulary wish
    const chooseVocabulary = req.body.list;
    const respose = await axios.get(webSource + chooseVocabulary + ".json");
    vocabulary = respose.data;

    res.render("index.ejs", {
        page: "instructions",
        // show witch level
        vocabulary: chooseVocabulary 
    })
});

// load game - get random word
app.get("/game", async (req, res) => {
    // get a random index
    let randomIndex = Math.floor(Math.random() * vocabulary.length);

    // whileloop until finding a substantiv 
    let itsSubstantiv = false;
    while (itsSubstantiv == false) {
        if (vocabulary[randomIndex].pos === "Substantiv") {
            userAnswer = null;
            // setting correct article
            correctAnswer = vocabulary[randomIndex].articles[0];
            // setting random word 
            word = vocabulary[randomIndex].sch[0].lemma;
            itsSubstantiv = true;
        } else {
            // repet loop until getting a random index 
            randomIndex = Math.floor(Math.random() * vocabulary.length);
        }
    }
    
    // load game window
    res.render("index.ejs", {
        page: "game",
        word: word,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer
    })
});

// check answer 
app.post("/checkAnswer", async (req, res) => {
    userAnswer = req.body.answer;
    res.render("index.ejs", {
        page: "game",
        word: word,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});