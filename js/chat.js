let currentRoom = ''; // Current active chat room

// Function to check if the user is logged in
function isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Load rooms for the logged-in user
function loadRooms() {
    const roomList = document.getElementById('chat-room-list');
    
    // Check if user is logged in
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
        roomList.style.display = 'none'; // Hide room list if not logged in
        return;
    }

    const rooms = JSON.parse(localStorage.getItem(`rooms_${loggedInUser.username}`)) || [];
    roomList.innerHTML = ''; // Clear the list

    // Show room list when logged in
    roomList.style.display = 'block'; 

    rooms.forEach(room => {
        const roomElement = document.createElement('li');
        
        const roomNameElement = document.createElement('span');
        roomNameElement.textContent = room;
        roomNameElement.addEventListener('click', () => selectRoom(room)); // Add event listener to switch rooms

        const deleteButton = document.createElement('button'); // Create delete button
        deleteButton.innerHTML = '<i class="delete fa-solid fa-xmark"></i>';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the room from being selected when deleting
            deleteRoom(room); // Call delete room function
        });

        roomElement.appendChild(roomNameElement);
        roomElement.appendChild(deleteButton); // Add delete button to the room element
        roomList.appendChild(roomElement);
    });
}

// Select a room and load its chat history
function selectRoom(room) {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
        alert("To choose a room, make sure you're logged in!"); // Alert user to log in
        return;
    }

    currentRoom = room;
    document.getElementById('display-box').innerHTML = ''; // Clear chat display
    loadChatHistory(room); // Load chat history of the selected room
}

// Function to create a new room for the logged-in user
function createNewRoom() {
    const loggedInUser = isLoggedIn();
    if (!loggedInUser) {
        alert("To create a room, make sure you're logged in"); // Alert user to log in
        return;
    }

    const roomName = prompt('Enter room name:');
    if (roomName) {
        const userRoomsKey = `rooms_${loggedInUser.username}`;
        const rooms = JSON.parse(localStorage.getItem(userRoomsKey)) || [];
        
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
            localStorage.setItem(userRoomsKey, JSON.stringify(rooms)); // Save rooms for this user
            loadRooms(); // Reload rooms list
        } else {
            alert('Room already exists!');
        }
    }
}

// Function to delete a room and its chat history
function deleteRoom(room) {
    const loggedInUser = isLoggedIn();
    const userRoomsKey = `rooms_${loggedInUser.username}`;
    const rooms = JSON.parse(localStorage.getItem(userRoomsKey)) || [];
    const updatedRooms = rooms.filter(r => r !== room); // Filter out the room to be deleted
    localStorage.setItem(userRoomsKey, JSON.stringify(updatedRooms)); // Update the rooms list for this user

    localStorage.removeItem(room); // Remove the chat history for the deleted room

    if (currentRoom === room) {
        currentRoom = ''; // If the deleted room is the current room, reset the current room
        document.getElementById('display-box').innerHTML = ''; // Clear the chat display
    }

    loadRooms(); // Reload rooms list
}


function sendMessage(event) {
    event.preventDefault(); // Prevent the default form submission

    if (!isLoggedIn()) {
        alert("To send a message, please make sure you're logged in!"); // Alert user to log in
        return; // Exit if not logged in
    }

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message && currentRoom) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const username = loggedInUser.username; // Get username from localStorage

        addMessageToChat(message, 'user', currentRoom, username); // Display user message with username
        saveMessageToHistory(message, 'user', currentRoom, username); // Save user message to history with username

        messageInput.value = ''; // Clear the input


        const BOT = 'Bot';
        // Auto-reply after 1 second
        setTimeout(() => {
            const reply = generateAutoReply(message); // Generate a reply based on user message
            addMessageToChat(reply, 'bot', currentRoom, BOT); // Display bot reply with 'Bot' as sender
            saveMessageToHistory(reply, 'bot', currentRoom, BOT); // Save bot reply to history with 'Bot' as sender
        }, 1000);
    } else {
        alert('Please select a room first!');
    }
}

// Function to add message to the chat display with separate elements for user and bot
function addMessageToChat(message, sender, room, username) {
    const displayBox = document.getElementById('display-box');
    const messageElement = document.createElement('div');
    
    // Set up different classes for user and bot messages
    if (sender === 'user') {
        messageElement.classList.add('message', 'user-message');
        messageElement.innerHTML = `<strong> ${username}</strong> <br>  ${message}`  ;
    } else if (sender === 'bot') {
        messageElement.classList.add('message', 'bot-message');
        messageElement.innerHTML = `<strong>${username}</strong> <br> ${message}`;
    }

    displayBox.appendChild(messageElement);
    displayBox.scrollTop = displayBox.scrollHeight; // Scroll to bottom
}

// Function to save message to localStorage with username
function saveMessageToHistory(message, sender, room, username) {
    const chatHistory = JSON.parse(localStorage.getItem(room)) || [];
    chatHistory.push({ message, sender, username }); // Save message with username
    localStorage.setItem(room, JSON.stringify(chatHistory));
}

// Function to load chat history with separated styling
function loadChatHistory(room) {
    const chatHistory = JSON.parse(localStorage.getItem(room)) || [];
    const displayBox = document.getElementById('display-box');
    displayBox.innerHTML = ''; // Clear previous messages

    chatHistory.forEach(messageObj => {
        const messageElement = document.createElement('div');
        const { message, sender, username } = messageObj;
        
        if (sender === 'user') {
            messageElement.classList.add('messsage', 'user-message');
            messageElement.innerHTML = `<strong>${username}</strong> <br> ${message}`;
        } else if (sender === 'bot') {
            messageElement.classList.add('message', 'bot-message');
            messageElement.innerHTML = `<strong>${username}</strong> <br> ${message}`;
        }

        displayBox.appendChild(messageElement);
    });

    displayBox.scrollTop = displayBox.scrollHeight; // Scroll to bottom
}


// Function to generate an auto-reply based on user input
function generateAutoReply(userMessage) {
    const responses = [
        "That's interesting!",
        "Can you tell me more?",
        "I see what you're saying.",
        "Thanks for sharing!",
        "I'll think about that."
    ];

    // You can customize replies based on user input
    if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        return "Hello! How can I help you today?";
    }
    else if(userMessage.toLowerCase().includes("name")) {
        return "My name is Lingumint!"
    }
    else{
        return responses[Math.floor(Math.random() * responses.length)]; // Random reply
    }
}

// Load chat rooms when the page loads
window.onload = loadRooms;

// Add event listener for creating a new room
document.getElementById('addnew-page').addEventListener('click', createNewRoom);

// Add event listener for the chat form submission
document.getElementById('chat-form').addEventListener('submit', sendMessage);
