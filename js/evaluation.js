let selectedRating = null;

// Function to check if the user is logged in
function isLoggedIn() {
    // Check if the user is logged in by looking for a specific key in localStorage
    return localStorage.getItem('loggedInUser'); // Modify this according to your login logic
}

// Add event listeners to rating buttons
document.querySelectorAll('.rate-score button').forEach(button => {
    button.addEventListener('click', function() {
        if (!isLoggedIn()) {
            alert("You need to be loggedin to provide your evaluation."); // Alert user to login
            return; // Exit if not loggedin
        }
        selectedRating = this.value;  // Store selected rating
        highlightButtons(selectedRating);  // Highlight buttons
    });
});

// Function to highlight buttons up to the selected rating
function highlightButtons(rating) {
    const ratingNum = parseInt(rating);
    document.querySelectorAll('.rate-score button').forEach(button => {
        const buttonValue = parseInt(button.value);
        if (buttonValue <= ratingNum) {
            button.classList.add('selected');  // Add highlight
        } else {
            button.classList.remove('selected');  // Remove highlight for unselected
        }
    });
}

// Show popup and overlay
function showPopup() {
    const popup = document.getElementById('showpopup');
    const overlay = document.getElementById('overlay');
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

// Close popup and overlay
function closePopup() {
    const popup = document.getElementById('showpopup');
    const overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

// Store evaluation data in localStorage
function storeEvaluation() {
    if (!isLoggedIn()) {
        alert("You need to be loggedin to provide your evaluation."); // Alert user to log in
        return; // Exit if not logged in
    }

    const feedbackText = document.getElementById('feedback').value.trim(); // Get feedback text and trim whitespace

    if (selectedRating === null) {
        alert("Please select a rating!"); // Alert for no rating selected
        return;
    }

    if (feedbackText === "") {
        alert("Please fill in the feedback field!"); // Alert if feedback is empty
        return; 
    }

    // ดึงข้อมูลของผู้ใช้ที่ล็อกอินอยู่จาก localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const username = loggedInUser.username;

    // ข้อมูลการประเมิน
    const evaluation = {
        username: username,   // เก็บชื่อผู้ใช้ลงใน evaluation
        rating: selectedRating, // เก็บคะแนนที่เลือก
        feedback: feedbackText  // เก็บข้อความ Feedback
    };

    // บันทึกข้อมูลการประเมินลง localStorage (หรือส่งไปเซิร์ฟเวอร์)
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
    evaluations.push(evaluation);
    localStorage.setItem('evaluations', JSON.stringify(evaluations));

    // Clear form
    document.getElementById('feedback').value = '';
    selectedRating = "";
    highlightButtons(0);  // Reset button colors

    showPopup();  // Show the thank you popup
}

// Event listener for the send button
document.getElementById('sending').addEventListener('click', storeEvaluation);

// Event listener for the close popup button
document.getElementById('close-popup').addEventListener('click', closePopup);
