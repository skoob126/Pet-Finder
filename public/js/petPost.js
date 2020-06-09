$(document).ready(() => {
  // gets an optional query string from our url
  const url = window.location.search;
  let postId;
  let userId;
  // sets a flag for whether or not we're updating a post to be false initially
  let updating = false;

  // if we have this section in our url, we pull out the post id or user id from the url
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId);
  } else if (url.indexOf("?User_id=") !== -1) {
    userId = url.split("=")[1];
  }

  // getting jQuery references to the post inputs
  const petForm = $("#petForm");
  const titleInput = $("#title");
  const locationInput = $("#location");
  const emailInput = $("#email");
  const bodyInput = $("#body");
  const uploadImageInput = $("#image");
  const categorySelect = $("#category");

  // giving the petSelect a default value
  categorySelect.val("Lost Pet");

  // adding an event listener for when the form is submitted
  $(petForm).on("submit", event => {
    event.preventDefault();
    console.log(event);
    // wont submit the post if we are missing values in listed inputs
    if (
      !titleInput.val().trim() ||
      !locationInput.val().trim() ||
      !emailInput.val().trim() ||
      !bodyInput.val().trim() ||
      !categorySelect.val().trim()
    ) {
      return;
    }
    // constructing a newPost object to hand to the database
    const newPost = {
      title: titleInput.val().trim(),
      location: locationInput.val().trim(),
      email: emailInput.val().trim(),
      body: bodyInput.val().trim(),
      image: uploadImageInput.val().trim(),
      category: categorySelect.val().trim(),
      userId: userId
    };
    // if we're updating a post run updatePost to update a post
    // otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    } else {
      submitPost(newPost);
      postEmail(newPost);
    }
  });

  // submits a new post and brings user to members page upon completion
  function submitPost(Post) {
    $.post("/api/posts/", Post, () => {
      window.location.href = "/members";
    });
  }
  // sends user an email after post is created
  function postEmail(Post) {
    $.post("/api/email/", Post);
  }

  // gets post data for a post if we're editing
  function getPostData(postId) {
    $.get("/api/posts/" + postId).then(data => {
      if (data) {
        // if this post exists, prefill our pet post form with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        emailInput.val(data.email);
        bodyInput.val(data.body);
        locationInput.val(data.location);
        categorySelect.val(data.category);
        uploadImageInput.val(data.image);
        // if we have a post with this id, set a flag for us to know to update the post when we hit submit
        updating = true;
      }
    });
  }
  // calling the above function
  getPostData();

  // update a given post, bring user to the members page where the post will be generated
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    }).then(() => {
      window.location.href = "/members";
    });
  }
});
