const loginForm = document.getElementById("admin-login-form");

const usernameInput = document.getElementById("admin-username");

const passwordInput = document.getElementById("admin-password");

const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginError.textContent = "";

  try {
    const response = await fetch("https://voyageadventures-backend.onrender.com/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("adminToken", data.token);

    window.location.href = "admin.html";
  } catch (error) {
    console.error("Login failed:", error);

    loginError.textContent = error.message || "Unable to login.";
  }
});
