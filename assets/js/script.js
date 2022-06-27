const header = $("#header");
const viewHighscoresLink = header.find("#link-view-highscore");
const countDown = header.find(".countdowm");

const intro = $("#introduction");
const startQuiz = $("#startQuiz");

const quizPage = $(".quiz");

const scoringsheet = $(".scoringsheet");

const scoreforms = $(".scoreforms");

var questionIndex = 0;
var currentCountDown = 0;
var currentScore = 0;
var interval = undefined;

function hideElement(el) {
    var $el = $(el);
    $el.hide();
}

function showElement(el) {
    var $el = $(el);
    $el.show();
}

function renderQuestion(question){
    clearQuestion();
    quizPage.find(".question").text(question.title);
    
    const choices = quizPage.find(".choices");
    question.choices.forEach(choice => {
        choices.append("<li><button>" + choice + "</button></li>");
    });

    quizPage.find(".choices").find("button").on("click", function (event) {
        var $button = $(event.target);
        if($button.text() === question.answer){
            quizPage.find(".result").text("correct!");
            currentScore++;
        }else{
            quizPage.find(".result").text("wrong!");
            currentCountDown -= 10;
            if(currentCountDown < 1){
                countDown.text(0)
                renderscoreforms();
            }
        }

        choices.find("button").prop("disabled",true);

        setTimeout(function(){
            nextQuestion();
        }, 500)
    })

    questionIndex++; // increment questionIndex
}

function nextQuestion() {

    if(questions.length > questionIndex){
        const question = questions[questionIndex];
        renderQuestion(question);
    }else{
        renderscoreforms();
    }

}

function clearQuestion(){
    quizPage.find(".choices").empty();
    quizPage.find(".question").empty();
    quizPage.find(".result").text("");
}

function renderscoreforms(){

    var score = currentCountDown > 0 ? currentCountDown : 0;
    if(questions.length === questionIndex && currentScore === 0){
        score = 0;
    }

    scoreforms.find(".finalscore").text(score);
    scoreforms.find("input").val("");
    clearInterval(interval);
    hideElement(quizPage);
    showElement(scoreforms);
}

function renderHighScores() {
    hideElement(scoreforms);
    showElement(scoringsheet);

    scoringsheet.find(".results").empty();
    var scores = JSON.parse(localStorage.getItem("scores"));
    if(scores)
        scores.forEach(function(score){
            scoringsheet.find(".results").append(`<li>${score.initials} - ${score.score}</li>`);
        });
    
    scoringsheet.find("#goBack").on("click", function(event) {
        event.preventDefault();
        goBack();
    });

    scoringsheet.find("#clearScores").on("click", function(event) {
        event.preventDefault();
        clearScores();
    });

}

function goBack() {
    init();
    showElement(intro);
}

function saveScore(initials, score) {
    // to local storage
    var lsScores = localStorage.getItem("scores");
    var scores = lsScores ? JSON.parse(lsScores) : [];
    
    scores.push({initials, score});
    localStorage.setItem("scores", JSON.stringify(scores));
}

function clearScores() {
    localStorage.removeItem("scores");
    scoringsheet.find(".results").empty();
}

function reset() {
    questionIndex = 0;
    currentScore = 0;
}

function countDownTimer(){
    currentCountDown = 75;
    interval = setInterval(function() {
        currentCountDown--;
        countDown.text(currentCountDown)
        // Display 'counter' wherever you want to display it.
        if (currentCountDown===0) {
            clearInterval(interval);
            renderscoreforms();
        }
    }, 1000);
}

// function init is called upon page load
function init(){
    hideElement(quizPage)
    hideElement(scoreforms)
    hideElement(scoringsheet)
    countDown.text(0);
}

// Events
viewHighscoresLink.on("click", () => {
    init();
    hideElement(intro);
    renderHighScores();
})

startQuiz.on("click", () => {
    hideElement(intro);
    reset();

    const question = questions[questionIndex];
    
    renderQuestion(question);
    showElement(quizPage);
    countDownTimer();
})

scoreforms.find("form[name='form-score']").submit(function(event){
    event.preventDefault();
    var $form = $(event.target);
    var info = $form.serializeArray();
    var initials = info[0].value;
    if(initials){
        var score = currentCountDown > 0 ? currentCountDown : 0;
        if(questions.length === questionIndex && currentScore === 0){
            score = 0;
        }
    
        saveScore(initials, score);
        renderHighScores();
    }
})

init();