let ipcData = [];

// Load IPC JSON data
fetch('ipc.json')
    .then(response => response.json())
    .then(data => {
        ipcData = data; // Store the data in the global variable
    })
    .catch(error => console.error('Error loading JSON:', error));

function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const chatbox = document.getElementById("chatbox");

    // Display user message
    chatbox.innerHTML += `<div class="message user">${userInput}</div>`;

    // Clear the input field
    document.getElementById("userInput").value = "";

    // Find the relevant section based on user input
    const response = findRelevantSection(userInput);

    // Display bot response
    chatbox.innerHTML += `<div class="message bot">${response}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function findRelevantSection(query) {
    const lowerCaseQuery = query.toLowerCase();
    
    for (const section of ipcData) {
        if (section.section_desc.toLowerCase().includes(lowerCaseQuery) || section.section_title.toLowerCase().includes(lowerCaseQuery)) {
            return `Section ${section.Section}: ${section.section_title}<br>${section.section_desc}`;
        }
    }
    
    // If no section is found, provide alternative suggestions
    const suggestions = ipcData.map(section => section.section_title).join(', ');
    return `I'm sorry, I couldn't find any relevant information. You might want to ask about: ${suggestions}`;
}

function saveChat() {
    var chatbox = document.getElementById('chatbox');
    var messages = chatbox.getElementsByClassName('message');
    var chatContent = '';

    // Collect all messages
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i].innerText;
        var sender = messages[i].classList.contains('user') ? 'User' : 'Bot';
        chatContent += sender + ': ' + message + '\n';
    }

    // Create a Blob object to hold the text data
    var blob = new Blob([chatContent], { type: 'text/plain' });

    // Create a download link
    var downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'chat_history.txt';

    // Trigger the download
    downloadLink.click();
}
