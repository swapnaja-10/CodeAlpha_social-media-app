// ✅ Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// ✅ Create Post
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = document.getElementById("postContent").value.trim();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Post created!");
      document.getElementById("postForm").reset();
      loadPosts(); // Refresh posts
    } else {
      alert(data.message || "Failed to create post.");
    }
  } catch (err) {
    console.error("Post Error:", err);
    alert("Error connecting to server.");
  }
});

// ✅ Load Posts
async function loadPosts() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    const feed = document.getElementById("feed");
    feed.innerHTML = "";

    data.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post-card";
      postDiv.innerHTML = `
        <h4>@${post.username}</h4>
        <p>${post.content}</p>
        <small>${new Date(post.createdAt).toLocaleString()}</small>
      `;
      feed.appendChild(postDiv);
    });
  } catch (err) {
    console.error("Load Posts Error:", err);
    alert("Failed to load posts.");
  }
 postDiv.innerHTML = `
  <h4>@${post.username}</h4>
  <p>${post.content}</p>
  <button onclick="likePost('${post._id}')">❤️ Like (${post.likes?.length || 0})</button>
  <small>${new Date(post.createdAt).toLocaleString()}</small>
`;
}

async function likePost(postId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(data.message);
    loadPosts(); // Reload post list to show updated like count
  } catch (error) {
    alert("Like failed");
    console.error("Like Error:", error);
  }
}

// ✅ On Page Load
window.onload = function () {
  loadPosts();

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      document.getElementById("username").textContent = payload.username || "User";
    } catch (err) {
      console.error("Invalid token");
      document.getElementById("username").textContent = "User";
    }
  }
};
