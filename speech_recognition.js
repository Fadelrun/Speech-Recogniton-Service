document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const saveButton = document.getElementById('saveButton');
    const copyButton = document.getElementById('copyButton');
    const resultDiv = document.getElementById('result');
    const languageSelect = document.getElementById('languageSelect');
    
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        alert("Твой браузер не поддерживает это.");
        return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        console.log("Запись началась.");
        alert("Запись началась.");
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
        console.error("", event);
        alert("Произошла ошибка при распознавании: " + event.error);
    };

    recognition.onend = function() {
        console.log("Запись окончена.");
        alert("Запись окончена.");
    };

    startButton.addEventListener('click', function() {
        recognition.lang = languageSelect.value;
        recognition.start();
    });

    stopButton.addEventListener('click', function() {
        recognition.stop();
    });

    saveButton.addEventListener('click', function() {
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
            alert('Текст скопирован');
        }).catch(function(error) {
            console.error('Ошибка в копировании: ', error);
        });
    });
});
