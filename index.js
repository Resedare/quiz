const questions = [
    {
        question: "Какой язык работает в браузере?",
        options: ["Java", "C", "Python", "JavaScript"],
        correct: 4,
    },
    {
        question: "Что означает CSS?",
        options: [
            "Central Style Sheets",
            "Cascading Style Sheets",
            "Cascading Simple Sheets",
            "Cars SUVs Sailboats",
        ],
        correct: 2,
    },
    {
        question: "Что означает HTML?",
        options: [
            "Hypertext Markup Language",
            "Hypertext Markdown Language",
            "Hyperloop Machine Language",
            "Helicopters Terminals Motorboats Lamborginis",
        ],
        correct: 1,
    },
    {
        question: "В каком году был создан JavaScript?",
        options: ["1996", "1995", "1994", "все ответы неверные"],
        correct: 2,
    },
];

const startButton = document.querySelector('.quiz__button--start');
const quizMenu = document.querySelector('.quiz__block');
const startMenu = document.querySelector('.quiz__start-menu')

startButton.addEventListener('click', function (e) { // старт квиза
    e.preventDefault();

    startMenu.classList.add('hide')
    quizMenu.classList.remove('hide')

    randomQuestion()
})

const optionElements = document.querySelectorAll('.option')

const option1 = document.querySelector('.option1'), // все ответы
    option2 = document.querySelector('.option2'),
    option3 = document.querySelector('.option3'),
    option4 = document.querySelector('.option4');

const questionName = document.querySelector('.question-name'), // название и текущий вопрос
    numberOfQuestion = document.querySelector('.number-of-question'),
    numberOfAllQuestions = document.querySelector('.number-of-all-questions');

const btnNext = document.querySelector('.options--next'); // кнопка далее

let indexOfQuestion = 0 // текущий вопрос
let indexOfPage = 0; // текущая страница

let score = 0; // итого

const correctAnswer = document.querySelector('.correct') // верный ответ

function load() {
    numberOfAllQuestions.innerHTML = questions.length;

    questionName.innerHTML = questions[indexOfQuestion].question;

    option1.innerHTML = questions[indexOfQuestion].options[0];
    option2.innerHTML = questions[indexOfQuestion].options[1];
    option3.innerHTML = questions[indexOfQuestion].options[2];
    option4.innerHTML = questions[indexOfQuestion].options[3];

    numberOfQuestion.innerHTML = indexOfPage + 1; //
    indexOfPage++; // увеличение индекса страницы
}
let completedAnswers = [];

function randomQuestion() {
    let randomNumber = Math.floor(Math.random() * questions.length);

    if (completedAnswers.length === questions.length) {
        quizOver();
        return;
    }

    if (completedAnswers.includes(randomNumber)) {
        randomQuestion();
        return;
    }

    indexOfQuestion = randomNumber;
    load();
    completedAnswers.push(indexOfQuestion);
}


function quizOver() {
    alert(`Вы набрали ${score} верных ответов!`)
}

const checkAnswer = el => {
    if (el.target.dataset.id == questions[indexOfQuestion].correct) {
        el.target.classList.add('correct');
        score++;
    } else {
        el.target.classList.add('incorrect')
    }
    disableOptions()
}
function disableOptions() {
    optionElements.forEach(item => {
        item.classList.add('disabled');
        if (item.dataset.id == questions[indexOfQuestion].correct) {
            item.classList.add('correct');
        }
    })
}
function enableOptions() {
    optionElements.forEach(item => {
        item.classList.remove('disabled', 'correct', 'incorrect');
    })
}
for (option of optionElements) {
    option.addEventListener('click', e => {
        checkAnswer(e);
    })
}

const validate = () => {
    if (!optionElements[0].classList.contains('disabled')) {
        alert('Вам нужно выбрать один из вариантов ответа')
    } else {
        randomQuestion();
        enableOptions();
    }
}

btnNext.addEventListener('click', validate)