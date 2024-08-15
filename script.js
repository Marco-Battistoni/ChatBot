const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const scoreDisplay = document.getElementById('score');

// Array de preguntas con respuestas y pistas
const questions = [
    {
        question: "The next best alternative that is forgone upon making a choice is known as...",  // Pregunta
        answer: "opportunity cost",  // Respuesta correcta
        hints: ["_ _ _ _R_U_ _ _ _  \n  _ _S_", "O_ _OR_U_ _ _Y   _ _OS", "OP_ORTU_ _TY   _OST"]  // Pistas en orden
    },
    {
        question: "Those resources needed to produce goods or services", 
        answer: "factors of production",
        hints: ["_A_ _ _R_   _ _   P_ _ _U_ _ _ _ _", "_AC _ _R_   _F   P_ _ _U_ _I_ _", "FAC _OR_   OF   P_O_U_TIO_"]
    },
    {
        question: "The lack of sufficient products to fulfil the total wants of the population",
        answer: "scarcity",
        hints: ["_ _ _ _ _ _ _Y", "_ _A_C_ _Y", "_ _ARC_ TY"]
    },
    {
        question: "A good or service essential for living",
        answer: "need",
        hints: ["_ _ _ _", "_E_ _", "_E_D"]
    },
    {
        question: "The difference between the selling price of a product and the cost of bought-in materials and components.",
        answer: "added value",
        hints: ["A _ _ _ _   _ _L_ _", "A _DE _   _ _L_ _", "A _DE _   _ _LUE"]
    }
];

// Variables para rastrear el estado del juego
let currentQuestionIndex = 0;  // Índice de la pregunta actual
let currentHintIndex = 0;  // Índice de la pista actual
let score = 0;  // Puntuación del usuario

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

    if (currentQuestionIndex === 0 && userText.toLowerCase() === "empezar") {
        askQuestion();  // Iniciar la trivia si el usuario escribe "empezar"
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

// Función para hacer una pregunta y mostrar la primera pista
function askQuestion() {
    addMessage(questions[currentQuestionIndex].question, 'bot-message');  // Mostrar la pregunta
    currentHintIndex = 0;  // Reiniciar el índice de pistas
    showHint();  // Mostrar la primera pista
}

// Función para mostrar una pista
function showHint() {
    addMessage("Pista: " + questions[currentQuestionIndex].hints[currentHintIndex], 'bot-message');  // Mostrar la pista actual
}

// Función para verificar la respuesta del usuario
function checkAnswer(userText) {
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();  // Convertir la respuesta correcta a minúsculas
    if (userText.toLowerCase() === correctAnswer) {  // Convertir la respuesta del usuario a minúsculas y comparar
        handleCorrectAnswer();  // Si la respuesta es correcta
    } else {
        handleIncorrectAnswer();  // Si la respuesta es incorrecta
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
    addMessage('¡Correcto! Ganaste ' + points + ' puntos.', 'bot-message');  // Informar al usuario
    moveToNextQuestion();  // Pasar a la siguiente pregunta
}

// Función para manejar una respuesta incorrecta
function handleIncorrectAnswer() {
    currentHintIndex++;  // Incrementar el índice de pista
    if (currentHintIndex < questions[currentQuestionIndex].hints.length) {
        showHint();  // Mostrar la siguiente pista
    } else {
        score -= 3;  // Restar 3 puntos si falla después de 3 pistas
        updateScore();  // Actualizar la puntuación
        addMessage('Incorrecto. La respuesta correcta era: ' + questions[currentQuestionIndex].answer + '. Pierdes 3 puntos.', 'bot-message');  // Informar al usuario
        moveToNextQuestion();  // Pasar a la siguiente pregunta
    }
}

// Función para pasar a la siguiente pregunta o terminar el juego
function moveToNextQuestion() {
    currentQuestionIndex++;  // Avanzar al siguiente índice de pregunta
    if (currentQuestionIndex < questions.length) {
        askQuestion();  // Hacer la siguiente pregunta
    } else {
        addMessage('¡Felicidades, has terminado la trivia! Tu puntuación final es ' + score + ' puntos.', 'bot-message');  // Informar que terminó el juego
        currentQuestionIndex = 0;  // Reiniciar para un nuevo juego
        score = 0;  // Reiniciar la puntuación
        updateScore();  // Actualizar la pantalla
    }
}

// Función para actualizar la visualización de puntos
function updateScore() {
    scoreDisplay.textContent = score;  // Mostrar la puntuación actualizada
}
