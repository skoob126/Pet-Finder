/* eslint-disable quotes */
$(document).ready(() => {
  // global variables defined
  const golbalContainer = $("#globalPost");
  const userContainer = $("#userPost");
  const postCategory = $("#category");
  const locations = $("#locations");
  let userId;
  let newLocation = "All Locations";
  let posts;

  // get request to figure out which user is logged in and updates the HTML on the page with user specific details
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

  // get all posts in database by user to be displayed in user post section
  function getUserPosts() {
    $.get("/api/posts/user", data => {
      posts = data;
      if (!posts || !posts.length) {
        userDisplayEmpty();
      } else {
        initializeUserRows();
      }
    });
  }

  // calls above function
  getUserPosts();

  // InitializeGlobalRows handles appending all of our constructed post HTML inside
  function initializeUserRows() {
    userContainer.empty();
    const postsToAdd = [];
    for (let i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewUserRow(posts[i]));
    }
    userContainer.append(postsToAdd);
  }

  // format for creating cards html for the user post section based off posts with user id
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
      <img src="${post.image}" alt="" style="width:200px; height:200px">
      <br />
      <a href="mailto:${post.email}">${post.email}</a>
    </div>
  </div>`);
    return newPostCard;
  }

  // if there are no posts in comunity post section display this
  function displayEmpty() {
    golbalContainer.empty();
    const messageH2 = $(
      `<h2 style="text-align:center">No Community Posts</h2>`
    );
    golbalContainer.append(messageH2);
  }

  // get all posts in database to be displayed in community post section
  function getGlobalPosts(category) {
    // enables post to be rendered by catagorey if the catagory drop down is changed
    let categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts" + categoryString, data => {
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty();
      } else {
        initializeGlobalRows(posts);
        renderLocations(posts);
      }
    });
  }

  // calls the above function
  getGlobalPosts();

  // looks at current list of locations in category and creates a dropdown menu to filter by location
  function renderLocations(filteredPosts) {
    locations.empty();
    locations.append(
      `<option selected value="All Locations">All Locations</option>`
    );
    const cities = filteredPosts.map(filteredPosts => filteredPosts.location);
    const noDuplicateCity = Array.from(new Set(cities));
    noDuplicateCity.forEach(city => {
      locations.append(`<option value="${city}">${city}</option>`);
    });
  }

  // InitializeGlobalRows handles appending all of our constructed post HTML inside
  function initializeGlobalRows(filteredPosts) {
    golbalContainer.empty();
    const postsToAdd = [];
    for (let i = 0; i < filteredPosts.length; i++) {
      postsToAdd.push(createNewRow(filteredPosts[i]));
    }
    golbalContainer.append(postsToAdd);
  }

  // format for creating cards html for the comunity post section
  function createNewRow(post) {
    const newPostCard = $(`<div class="mb-5 card" style="border-radius: 2em">
    <div class="card-header" style="border-top-right-radius: 2em; border-top-left-radius: 2em">
      <h4 class="card-title">${post.title}</h4>
      <h6 class="card-location">${post.location}</h6>
      <h6 class="card-category">${post.category}</h6>
      </div>
      <div class="card-body">
        <p class="card-text">${post.body}</p>
        <img src="${post.image}" alt="" style="width:200px; height:200px">
        <br />
        <a href="mailto:${post.email}">${post.email}</a>
      </div>
    </div>`);
    return newPostCard;
  }

  // if there are no posts in comunity post section display this
  function userDisplayEmpty() {
    userContainer.empty();
    const messageH2 = $(`<h2 style="text-align:center">No User Posts</h2>`);
    userContainer.append(messageH2);
  }

  // specifing a post id to delete by when the delete button is clicked
  function handlePostDelete() {
    const id = $(this).val();
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

  // directing the edit button to the newpost page and including the post id for reference in the html
  function handlePostEdit() {
    const id = $(this).val();
    window.location.href = "/newpost?post_id=" + id;
  }

  // This function handles reloading new posts when the category changes
  function handleCategoryChange() {
    const newPostCategory = $(this).val();
    getGlobalPosts(newPostCategory);
  }

  // function called when location drop down is changed
  function handleLocationCahange() {
    newLocation = $(this).val();
    if (newLocation === "All Locations") {
      initializeGlobalRows(posts);
    } else {
      const byCity = posts.filter(post => post.location === newLocation);
      initializeGlobalRows(byCity);
    }
  }

  // event handelers for members page
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  postCategory.on("change", handleCategoryChange);
  locations.on("change", handleLocationCahange);
});
