document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const saveButton = document.getElementById('saveButton');
    const copyButton = document.getElementById('copyButton');
    const resultDiv = document.getElementById('result');
    const languageSelect = document.getElementById('languageSelect');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.getElementById('closeModal');

    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        showModal("Твой браузер не поддерживает это.");
        return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        showModal("Запись началась.");
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        resultDiv.innerHTML = `<strong>Итог:</strong> ${finalTranscript} <br> <strong>Текст:</strong> ${interimTranscript}`;
    };

    recognition.onerror = function(event) {
        showModal("Ошибка при распознавании: " + event.error);
    };

    recognition.onend = function() {
        showModal("Запись окончена.");
    };

    startButton.addEventListener('click', function() {
        recognition.lang = languageSelect.value;
        recognition.start();
    });

    stopButton.addEventListener('click', function() {
        recognition.stop();
    });

    saveButton.addEventListener('click', function() {
        showModal("Текстовый файл скачивается.");
        const text = resultDiv.innerText;
        const blob = new Blob([text], { type: 'text/plain' });
        const anchor = document.createElement('a');
        anchor.download = 'recognized_text.txt';
        anchor.href = window.URL.createObjectURL(blob);
        anchor.click();
    });

    copyButton.addEventListener('click', function() {
        const text = resultDiv.innerText;
        navigator.clipboard.writeText(text).then(function() {
            showModal('Текст скопирован');
        }).catch(function(error) {
            showModal('Ошибка копирования: ' + error);
        });
    });

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';

        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modal.style.display = 'none';
});
