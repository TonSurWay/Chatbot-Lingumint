// Function to handle user login
function loginUser(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Successful login
        alert('Login successful!');
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // Save logged-in user data
        window.location.href = 'index.html'; // Redirect to the profile page (or homepage)
        updateUI(); // Update the UI to show the profile icon
    } else {
        alert('Incorrect email or password!');
    }
}

// Function to handle user logout
function logoutUser() {
    localStorage.removeItem('loggedInUser'); // Remove logged-in user data
    alert("You're logged out!");
    window.location.href = 'login.html'; // Redirect to the login page
    updateUI(); // Update the UI to hide the profile icon and show the login button
}


// Function to update the UI based on login status
function updateUI() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const loginDropdown = document.getElementById('login-dropdown');
    const userDropdown = document.getElementById('user-dropdown');
    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;

    if (isSmallScreen && loggedInUser) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'none';
        loginDropdown.style.display = 'none';
        userDropdown.style.display = 'flex';
    } 
    else if (isSmallScreen && !loggedInUser){
        loginBtn.style.display = 'none';
        userProfile.style.display = 'none';
        loginDropdown.style.display = 'flex';
        userDropdown.style.display = 'none';
    }  
    else  if (loggedInUser) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        loginDropdown.style.display = 'none';
        userDropdown.style.display = 'flex';
    } else {
        loginBtn.style.display = 'flex';
        userProfile.style.display = 'none';
        loginDropdown.style.display = 'flex';
        userDropdown.style.display = 'none';
        }
    
}


// Initial call and attach resize event
// updateUI();
window.addEventListener("resize", updateUI);


function ToggleDropdown(){
    const side = document.getElementById('dropdown');

    side.style.display = 'flex';
}


function CloseDropdown(){
    const side = document.getElementById('dropdown');

    side.style.display = 'none';

}


// Event listeners for login and logout actions
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", loginUser);
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logoutUser);
    }

    // Update the UI when the page loads
    updateUI();
});

function LoginForm(){
    window.location.href = 'login.html';
}


document.getElementById('close-dropdown').addEventListener('click', CloseDropdown);
document.getElementById('open-dropdown').addEventListener('click', ToggleDropdown);

    















