// js/register.js

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = e.target.username.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (error) {
    alert("Error connecting to server.");
    console.error(error);
  }
});
