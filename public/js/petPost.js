$(document).ready(() => {
  // Gets an optional query string from our url (i.e. ?post_id=23)
  const url = window.location.search;
  let postId;
  let userId;
  // Sets a flag for whether or not we're updating a post to be false initially
  let updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In localhost:8080/cms?post_id=1, postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId);
  } else if (url.indexOf("?User_id=") !== -1) {
    userId = url.split("=")[1];
  }

  // ---------------Have not changed code above this line to handle editing a new post ---------------

  // Getting jQuery references to the post inputs
  const petForm = $("#petForm");
  const titleInput = $("#title");
  const locationInput = $("#location");
  const emailInput = $("#email");
  const bodyInput = $("#body");
  const uploadImageInput = $("#image");
  const categorySelect = $("#category");
  // Giving the petSelect a default value
  categorySelect.val("Lost Pet");
  // Adding an event listener for when the form is submitted
  $(petForm).on("submit", event => {
    event.preventDefault();
    console.log(event);
    // Wont submit the post if we are missing values in listed inputs
    if (
      !titleInput.val().trim() ||
      !locationInput.val().trim() ||
      !emailInput.val().trim() ||
      !bodyInput.val().trim() ||
      !categorySelect.val().trim()
    ) {
      return;
    }
    // Constructing a newPost object to hand to the database
    const newPost = {
      title: titleInput.val().trim(),
      location: locationInput.val().trim(),
      email: emailInput.val().trim(),
      body: bodyInput.val().trim(),
      image: uploadImageInput.val().trim(),
      category: categorySelect.val().trim(),
      userId: userId
    };
    console.log(newPost);
    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    } else {
      submitPost(newPost);
    }
  });

  // Submits a new post and brings user to members page upon completion
  function submitPost(Post) {
    $.post("/api/posts/", Post, () => {
      window.location.href = "/members";
    });
  }

  // Gets post data for a post if we're editing
  function getPostData(postId) {
    $.get("/api/posts/" + postId).then(data => {
      if (data) {
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        emailInput.val(data.email);
        bodyInput.val(data.body);
        locationInput.val(data.location);
        categorySelect.val(data.category);
        uploadImageInput.val(data.image);
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    }).then(() => {
      window.location.href = "/members";
    });
  }
  getPostData();
});
