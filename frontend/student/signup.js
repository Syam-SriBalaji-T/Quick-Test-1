import { FRONTEND_URL, BACKEND_URL } from "../config.js";

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();  // Prevent form's default behavior

    const userName = document.getElementById("userName").value.trim();
    const userEmail = document.getElementById("userEmail").value.trim();
    const userPassword = document.getElementById("userPassword").value.trim();

    // Simple validation
    if (userName.length === 0) {
        alert("Name should not be empty");
        return;
    }
    if (userEmail.length === 0) {
        alert("Email ID should not be empty");
        return;
    }
    if (userPassword.length === 0) {
        alert("Password should not be empty");
        return;
    }

    // mockPromise(userEmail)
    fetch(`${BACKEND_URL}/api/authenticate/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: userName,
            emailId: userEmail,
            password: userPassword
        })
    })    
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.message || "Sign up failed");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status) {
            alert(data.message);
            localStorage.setItem('token', data.token);
            window.location.href = "home.html";

            // Add to database
        } else {
            alert(data.message || "Sign up failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert(error.message);
    });
});