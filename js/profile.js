// Function to load user profile from Local Storage
function loadUserProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่

    if (loggedInUser) {
        document.getElementById('edit-User').value = loggedInUser.username;
        document.getElementById('edit-Email').value = loggedInUser.email;
        document.getElementById('edit-Tel').value = loggedInUser.telNumber;
        document.getElementById('edit-Status').value = loggedInUser.status || 'Online';
        
        // // Load and display the profile picture if it exists
        // const profilePreview = document.getElementById('profile-preview');
        // if (loggedInUser.Image) {
        //     profilePreview.src = loggedInUser.Image; // Set the src to the profile picture
        //     profilePreview.style.display = 'block'; // Show the profile picture
        // }
    }
     else {
        alert('User login information not found. Please login');
        window.location.href = 'login.html'; // กลับไปยังหน้า login หากไม่พบผู้ใช้ที่ล็อกอินอยู่
    }
}

// // Function to preview the profile picture
// function previewProfilePic(event) {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = function(e) {
//         const profilePreview = document.getElementById('profile-preview');
//         profilePreview.src = e.target.result; // Set the src to the file's data URL
//         profilePreview.style.display = 'block'; // Show the preview image
//     };

//     if (file) {
//         reader.readAsDataURL(file); // Read the file as a data URL
//     }
// }


// Function to save updated user profile to Local Storage
function saveUserProfile(event) {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        const currentUserIndex = users.findIndex(user => user.email === loggedInUser.email);

        if (currentUserIndex !== -1) {
            const currentUserData = users[currentUserIndex];

            const updatedUser = {
                ...currentUserData,
                username: document.getElementById('edit-User').value,
                email: document.getElementById('edit-Email').value,
                telNumber: document.getElementById('edit-Tel').value,
                status: document.getElementById('edit-Status').value

            };

            users[currentUserIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

            alert('อัปเดตโปรไฟล์สำเร็จ!');
            toggleEditMode(false);
        } else {
            alert('ไม่พบข้อมูลผู้ใช้');
        }
     } 
}


// Toggle edit mode on/off
function toggleEditMode(isEditing) {
    document.getElementById('edit-User').disabled = !isEditing;
    document.getElementById('edit-Email').disabled = !isEditing;
    document.getElementById('edit-Tel').disabled = !isEditing;
    document.getElementById('edit-Status').disabled = !isEditing;

    document.getElementById('edit-btn').style.display = isEditing ? 'none' : 'inline';
    document.getElementById('save-btn').style.display = isEditing ? 'inline' : 'none';
    document.getElementById('cancel-btn').style.display = isEditing ? 'inline' : 'none';
}

// Function to cancel editing
function cancelEdit() {
    loadUserProfile(); // โหลดข้อมูลผู้ใช้ใหม่เพื่อยกเลิกการแก้ไข
    toggleEditMode(false); // ปิดโหมดแก้ไข
}

// Load user profile when the page is loaded
window.onload = loadUserProfile;

// Add event listener for form submission
document.getElementById('profile-form').addEventListener('submit', saveUserProfile);

// Add event listener for edit and cancel buttons
document.getElementById('edit-btn').addEventListener('click', function() {
    toggleEditMode(true); // เปิดโหมดแก้ไข
});

document.getElementById('cancel-btn').addEventListener('click', cancelEdit); // ยกเลิกการแก้ไข


