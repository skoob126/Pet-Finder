$(document).ready(() => {
  const golbalContainer = $("#globalPost");
  const userContainer = $("#userPost");
  let userId;
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    userId = data.id;
    const postButton = $(".navbar-header");

    postButton.append(
      "<a class='navbar-brand' href='/newpost?User_id=" +
        userId +
        "'>Create a Post</a>"
    );
  });

  function getUserPosts() {
    $.get("/api/posts/user", data => {
      console.log(data);
      posts = data;
      if (!posts || !posts.length) {
        userDisplayEmpty();
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
    const newPostCard = $(`<div class="mb-5 card" style="border-radius: 2em">
    <div class="card-header" style="border-top-right-radius: 2em; border-top-left-radius: 2em">
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
    const newPostCard = $(`<div class="mb-5 card" style="border-radius: 2em">
      <div class="card-header" style="border-top-right-radius: 2em; border-top-left-radius: 2em">
      <h4 class="card-title">${post.title}</h4>
      <h6 class="card-location">${post.location}</h6>
      <h6 class="card-category">${post.category}</h6>
      <button type="button" value="${post.id}" class="btn btn-primary edit">Edit</button>
      <button type="button" value="${post.id}" class="btn btn-danger delete" >Delete</button>
      </div>
      <div class="card-body">
        <p class="card-text">${post.body}</p>
        <br />
        <a href="mailto:${post.email}">${post.email}</a>
      </div>
    </div>`);
    return newPostCard;
  }

  function handlePostDelete() {
    const id = $(this).val();
    console.log(id);
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(() => {
        getUserPosts();
      })
      .then(() => {
        getGlobalPosts();
      });
  }

  function handlePostEdit() {
    const id = $(this).val();
    console.log(id);
    window.location.href = "/newpost?post_id=" + id;
  }

  function userDisplayEmpty() {
    userContainer.empty();
    // eslint-disable-next-line quotes
    const messageH2 = $(`<h2 style="text-align:center">No User Posts</h2>`);
    userContainer.append(messageH2);
  }
  function displayEmpty() {
    golbalContainer.empty();
    const messageH2 = $(
      // eslint-disable-next-line quotes
      `<h2 style="text-align:center">No Community Posts</h2>`
    );
    golbalContainer.append(messageH2);
  }

  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
});
