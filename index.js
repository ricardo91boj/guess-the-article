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

    // load game window
    res.render("index.ejs", {
        page: "game",
        wordList: vocabulary
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});