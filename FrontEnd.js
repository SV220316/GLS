function ShowTextMode() {
    document.getElementById("message-container").style.display = "inline-block";
}

function Start_Logic() {
    // Speech To Text Engine Module:
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let lastTranscript = '';

    recognition.start();

    recognition.onresult = (event) => {
        let transcript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript = event.results[i][0].transcript;
            }
        }
        if (finalTranscript && finalTranscript !== lastTranscript) {
            lastTranscript = finalTranscript;
            sendToBackend(finalTranscript);
        }
    };
    const userInputField = document.getElementById('user-input');
    if (userInputField) {
        userInputField.addEventListener('keydown', handleInput);
    }

    async function handleInput(event) {
        if (event.key === 'Enter') {
            const userInput = document.getElementById('user-input').value;

            if (userInput.trim() !== '') {
                addMessage(userInput, 'user');
                document.getElementById('user-input').value = '';

                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userMessage: userInput }),
                    });

                    const data = await response.json();
                    addMessage(data.reply, 'bot');

                    // Text To Speech Engine
                    const get_AI_response = data.reply;
                    fetch(`/tts?text=${encodeURIComponent(get_AI_response)}`)
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to generate speech');
                            return response.blob();
                        })
                        .then(blob => {
                            const audio = new Audio(URL.createObjectURL(blob));
                            audio.play();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    }

    // Function to send the speech to text value to the backend
    async function sendToBackend(finalTranscript) {
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: finalTranscript }),
            });

            const data = await response.json();
            addMessage(data.reply, 'bot');

            // Text To Speech Engine
            const get_AI_response = data.reply;
            fetch(`/tts?text=${encodeURIComponent(get_AI_response)}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to generate speech');
                    return response.blob();
                })
                .then(blob => {
                    const audio = new Audio(URL.createObjectURL(blob));
                    audio.play();
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        } catch (error) {
            console.error('Error sending to backend:', error);
        }
    }
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the latest message
}
