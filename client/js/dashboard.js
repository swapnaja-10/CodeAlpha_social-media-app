document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

async function loadDashboard() {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "login.html");

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const posts = await res.json();
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post-card";
      postDiv.innerHTML = `
        <h3>@${post.username}</h3>
        <p>${post.content}</p>
        <small>${new Date(post.createdAt).toLocaleString()}</small>
        <div class="actions">
          <button onclick="likePost('${post._id}')">❤️ Like</button>
          <button onclick="commentPost('${post._id}')">💬 Comment</button>
          <button onclick="followUser('${post.user}')">➕ Follow</button>
        </div>
      `;
      container.appendChild(postDiv);
    });
  } catch (err) {
    alert("Failed to load dashboard");
  }
}

async function likePost(postId) {
  alert("Like functionality coming soon for post ID: " + postId);
}

async function commentPost(postId) {
  const comment = prompt("Write your comment:");
  if (!comment) return;

  // send to backend
  alert(`Comment "${comment}" added to post ${postId}`);
}

async function followUser(userId) {
  alert("Follow functionality coming soon for user: " + userId);
}

window.onload = loadDashboard;
