const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const scoreDisplay = document.getElementById('score');

// Array de preguntas con respuestas y pistas
const questions = [
    {
        type: 'text',
        question: "The next best alternative that is forgone upon making a choice is known as...",
        answer: "opportunity cost",
        hints: ["_ _ _ _R_U_ _ _ _  \n  _ _S_", "O_ _OR_U_ _ _Y   _ _OS", "OP_ORTU_ _TY   _OST"]
    },
    {
        type: 'text',
        question: "Those resources needed to produce goods or services",
        answer: "factors of production",
        hints: ["_A_ _ _R_   _ _   P_ _ _U_ _ _ _ _", "_AC _ _R_   _F   P_ _ _U_ _I_ _", "FAC _OR_   OF   P_O_U_TIO_"]
    },
    {
        type: 'text',
        question: "The lack of sufficient products to fulfil the total wants of the population",
        answer: "scarcity",
        hints: ["_ _ _ _ _ _ _Y", "_ _A_C_ _Y", "_ _ARC_ TY"]
    },
    {
        type: 'text',
        question: "A good or service essential for living",
        answer: "need",
        hints: ["_ _ _ _", "_E_ _", "_E_D"]
    },
    {
        type: 'text',
        question: "The difference between the selling price of a product and the cost of bought-in materials and components.",
        answer: "added value",
        hints: ["A _ _ _ _   _ _L_ _", "A _DE _   _ _L_ _", "A _DE _   _ _LUE"]
    },
    {
        type: 'multiple-choice',
        question: "Which of the following is a primary color?",
        options: {
            A: "Red",
            B: "Green",
            C: "Purple",
            D: "Orange"
        },
        answer: "A",  // La letra de la opción correcta
        correctAnswer: "Red"  // La palabra de la opción correcta
    },
    {
        type: 'multiple-choice',
        question: "Which planet is known as the Red Planet?",
        options: {
            A: "Earth",
            B: "Mars",
            C: "Jupiter",
            D: "Venus"
        },
        answer: "B",
        correctAnswer: "Mars"
    }
];

// Variables para rastrear el estado del juego
let currentQuestion;  // Pregunta actual
let currentHintIndex = 0;  // Índice de la pista actual
let score = 0;  // Puntuación del usuario
let gameStarted = false;  // Indica si el juego ha comenzado

// Pulsar "Enter" activa el botón "Enviar"
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();  // Simula el clic en el botón "Enviar"
    }
});

sendButton.addEventListener('click', () => {
    const userText = userInput.value.trim();  // Obtiene el texto del usuario
    if (userText === '') return;  // No hacer nada si el input está vacío

    addMessage(userText, 'user-message');  // Añadir mensaje del usuario al chat
    userInput.value = '';  // Limpiar la entrada de texto

    if (!gameStarted) {
        gameStarted = true;  // Marcar el juego como comenzado
        askQuestion();  // Iniciar la primera pregunta
    } else {
        checkAnswer(userText);  // Verificar la respuesta del usuario
    }
});

// Función para añadir un mensaje en el chat
function addMessage(text, className) {
    const message = document.createElement('div');
    message.className = `chat-message ${className}`;
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;  // Desplazarse hacia abajo para mostrar el último mensaje
}

// Función para seleccionar una pregunta aleatoria
function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Función para hacer una pregunta y mostrar las opciones
function askQuestion() {
    currentQuestion = getRandomQuestion();  // Seleccionar una pregunta aleatoria
    if (currentQuestion.type === 'multiple-choice') {
        showMultipleChoiceQuestion(currentQuestion);
    } else {
        showTextQuestion(currentQuestion);
    }
}

// Función para mostrar una pregunta de texto y la primera pista
function showTextQuestion(question) {
    addMessage(question.question, 'bot-message');  // Mostrar la pregunta
    currentHintIndex = 0;  // Reiniciar el índice de pistas
    showHint();  // Mostrar la primera pista
}

// Función para mostrar una pregunta de opción múltiple
function showMultipleChoiceQuestion(question) {
    let optionsText = '';
    for (const [key, value] of Object.entries(question.options)) {
        optionsText += `${key}) ${value}\n`;
    }
    addMessage(question.question + '\n' + optionsText, 'bot-message');  // Mostrar la pregunta y opciones
}

// Función para mostrar una pista
function showHint() {
    if (currentQuestion.type === 'text') {
        addMessage("Hint: " + currentQuestion.hints[currentHintIndex], 'bot-message');  // Mostrar la pista actual
    }
}

// Función para verificar la respuesta del usuario
function checkAnswer(userText) {
    if (currentQuestion.type === 'multiple-choice') {
        const correctAnswer = currentQuestion.answer.toUpperCase();  // Respuesta correcta en mayúsculas
        if (userText.toUpperCase() === correctAnswer || userText.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    } else {
        const correctAnswer = currentQuestion.answer.toLowerCase();  // Convertir la respuesta correcta a minúsculas
        if (userText.toLowerCase() === correctAnswer) {  // Convertir la respuesta del usuario a minúsculas y comparar
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    }
}

// Función para manejar una respuesta correcta
function handleCorrectAnswer() {
    let points;
    if (currentHintIndex === 0) {
        points = 10;  // 10 puntos si acierta en la primera pista
    } else if (currentHintIndex === 1) {
        points = 7;  // 7 puntos si acierta en la segunda pista
    } else {
        points = 3;  // 3 puntos si acierta en la tercera pista
    }
    score += points;  // Sumar puntos
    updateScore();  // Actualizar la puntuación en la pantalla
    addMessage('Perfect! +' + points + ' points.', 'bot-message');  // Informar al usuario
    moveToNextQuestion();  // Pasar a la siguiente pregunta
}

// Función para manejar una respuesta incorrecta
function handleIncorrectAnswer() {
    currentHintIndex++;  // Incrementar el índice de pista
    if (currentHintIndex < currentQuestion.hints.length) {
        showHint();  // Mostrar la siguiente pista
    } else {
        score -= 3;  // Restar 3 puntos si falla después de 3 pistas
        updateScore();  // Actualizar la puntuación
        addMessage('Wrong. The correct answer was: ' + currentQuestion.answer + '. -3 points.', 'bot-message');  // Informar al usuario
        moveToNextQuestion();  // Pasar a la siguiente pregunta
    }
}

// Función para pasar a la siguiente pregunta o terminar el juego
function moveToNextQuestion() {
    // Seleccionar una nueva pregunta aleatoria
    currentQuestion = getRandomQuestion();
    if (currentQuestion) {
        askQuestion();  // Hacer la siguiente pregunta
    } else {
        addMessage('Congratulations, you have finished the trivia! Your final score is ' + score + ' points.', 'bot-message');  // Informar que terminó el juego
        currentQuestion = null;  // Reiniciar para un nuevo juego
        score = 0;  // Reiniciar la puntuación
        updateScore();  // Actualizar la pantalla
        gameStarted = false;  // Reiniciar el estado del juego
    }
}

// Función para actualizar la visualización de puntos
function updateScore() {
    scoreDisplay.textContent = score;  // Mostrar la puntuación actualizada
}
