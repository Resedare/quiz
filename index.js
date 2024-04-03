const startButton = document.querySelector('.start-button');
const quizMenu = document.querySelector('.quiz__block');
const startMenu = document.querySelector('.quiz__start-menu')
const quizList = document.querySelector('.quiz-list')
const quizWindow = document.querySelector('.quiz')


const quizTitle = document.querySelector('.quiz__title');

const btnNext = document.querySelector('.options--next'); // кнопка далее
const btnBack = document.querySelector('.result-button'); // кнопка вернуться

const modal = document.querySelector('.quiz-over__modal'); // модальное окно

let indexOfQuestion = 0 // текущий вопрос
let indexOfPage = 0; // текущая страница

let score = 0; // итого

const correctAnswer = document.querySelector('.correct') // верный ответ

const optionElements = document.querySelectorAll('.option')

const questionName = document.querySelector('.question-name'), // название и текущий вопрос
    numberOfQuestion = document.querySelector('.number-of-question'),
    numberOfAllQuestions = document.querySelector('.number-of-all-questions'),
    amountOfQuestion = document.querySelectorAll('.question-amount');

startButton.addEventListener('click', async function (e) { // старт квиза
    e.preventDefault();

    startMenu.classList.add('hide')
    quizMenu.classList.remove('hide')

    const selectedQuizName = startButton.dataset.name;
    const data = await loadQuizData(selectedQuizName);
    startQuiz(data);
})

async function loadQuizData(quizName) {
    const response = await fetch("quizzes.json");
    const quizzes = await response.json();

    return quizzes[quizName]
}

function startQuiz(data) {
    let completedAnswers = [];            // функция старта квиза и генерации вопросов
    function randomQuestion(data) { // генерация рандомных вопросов из массива

        let randomNumber = Math.floor(Math.random() * data.length);

        if (completedAnswers.length === data.length) {
            quizOver();
            return;
        }

        if (completedAnswers.includes(randomNumber)) {
            randomQuestion(data);
            return;
        }

        indexOfQuestion = randomNumber;
        load(data);
        completedAnswers.push(indexOfQuestion);
    }
    randomQuestion(data)
    function toggleOptions(isEnabled) {
        optionElements.forEach(item => {
            if (isEnabled) {
                // Удаляем класс 'disabled', чтобы включить элементы
                item.classList.remove('disabled', 'correct', 'incorrect');
            } else {
                // Добавляем класс 'disabled', чтобы выключить элементы
                item.classList.add('disabled');
                // Если элемент является правильным ответом, добавляем класс 'correct'
                if (item.dataset.id == data[indexOfQuestion].correct) {
                    item.classList.add('correct');
                }
            }
        });
    }

    function checkAnswer(el, data) { // проверка правильности ответа
        if (el.target.dataset.id == data[indexOfQuestion].correct) {
            el.target.classList.add('correct');
            score++;
        } else {
            el.target.classList.add('incorrect')
        }
        toggleOptions(false)
    }

    for (option of optionElements) { // событие при нажатии на ответ
        option.addEventListener('click', e => {
            checkAnswer(e, data);
        })
    }

    function quizOver() { // конец квиза
        modal.classList.remove('hide')
        const result = document.querySelector('.quiz-result');

        result.innerHTML = `Ваш результат ${score} из ${data.length}`
    }

    const validate = () => { // валидация, проверка выбора ответов
        if (!optionElements[0].classList.contains('disabled')) {
            alert('Вам нужно выбрать один из вариантов ответа')
        } else {
            randomQuestion(data);
            toggleOptions(true);
        }
    }

    btnNext.addEventListener('click', validate)
    btnBack.addEventListener('click', () => {
        window.location.reload()
    })
}



const chooseButton = document.querySelectorAll('.quiz-card__choose-button')
for (let button of chooseButton) { // выбор квиза
    button.addEventListener('click', function (e) {
        e.preventDefault()

        quizTitle.innerHTML = e.target.dataset.name
        startButton.dataset.name = e.target.dataset.name
        quizList.classList.add('hide')
        quizWindow.classList.remove('hide')
        quizWindow.classList.add('active')
    })
}

async function loadQuizDataUI() {
    const response = await fetch("quizzes.json");
    const quizzes = await response.json();

    Object.keys(quizzes).forEach(quizName => {
        const numOfQuestions = quizzes[quizName].length;
        document.querySelector(`.quiz-card__questions-count[data-name="${quizName}"]`).textContent = `Количество вопросов: ${numOfQuestions}`;
    })
}

function load(data) { // загрузка всех вопросов
    numberOfAllQuestions.innerHTML = data.length;

    questionName.innerHTML = data[indexOfQuestion].question;

    data[indexOfQuestion].options.forEach((option, index) => {
        optionElements[index].textContent = option;
    });

    numberOfQuestion.innerHTML = indexOfPage + 1; //
    indexOfPage++; // увеличение индекса страницы
}




document.addEventListener("DOMContentLoaded", loadQuizDataUI);