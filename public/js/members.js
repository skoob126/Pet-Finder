$(document).ready(() => {
  const golbalContainer = $("#globalPost");

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    const userId = data.id;
    const postButton = $("#newPost");

    postButton.append(
      "<a href='/newpost?User_id=" + userId + "'>Create a Post</a>"
    );
  });

  function getGlobalPosts(category) {
    let categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts" + categoryString, data => {
      console.log(data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty();
      } else {
        initializeGlobalRows();
      }
    });
  }
  // Getting the initial list of global posts
  getGlobalPosts();
  // InitializeGlobalRows handles appending all of our constructed post HTML inside
  // blogContainer
  function initializeGlobalRows() {
    golbalContainer.empty();
    const postsToAdd = [];
    for (let i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    golbalContainer.append(postsToAdd);
  }
  // This function constructs a post's HTML
  function createNewRow(post) {
    const newPostCard = $(`<div class="card">
      <div class="card-header">
      <h4 class="card-title">${post.title}</h4>
      <h6 class="card-location">${post.location}</h6>
      <h6 class="card-category">${post.category}</h6>
      </div>
      <div class="card-body">
        <p class="card-text">${post.body}</p>
        <br />
        <a href="mailto:${post.email}">${post.email}</a>
      </div>
    </div>`);
    return newPostCard;
  }
});
