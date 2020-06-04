$(document).ready(() => {
  const golbalContainer = $("#globalPost");
  const userContainer = $("#userPost");
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    const userId = data.id;
    const postButton = $(".navbar-header");

    postButton.append(
      "<a class='navbar-brand' href='/newpost?User_id=" +
        userId +
        "'>Create a Post</a>"
    );
  });

  function getUserPosts(category) {
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
        initializeUserRows();
      }
    });
  }

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
  getUserPosts();
  // InitializeGlobalRows handles appending all of our constructed post HTML inside
  // blogContainer
  function initializeUserRows() {
    userContainer.empty();
    const postsToAdd = [];
    for (let i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewUserRow(posts[i]));
    }
    userContainer.append(postsToAdd);
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
    const newPostCard = $(`<div class="mt-3 card" style="border-radius: 2em">
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

  function createNewUserRow(post) {
    const newPostCard = $(`<div class="mt-3 card" style="border-radius: 2em">
      <div class="card-header">
      <h4 class="card-title">${post.title}</h4>
      <h6 class="card-location">${post.location}</h6>
      <h6 class="card-category">${post.category}</h6>
      <button type="button" value="${post.id}" class="btn btn-primary">Edit</button>
      <button type="button" value="${post.id}" class="btn btn-danger">Delete</button>
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
