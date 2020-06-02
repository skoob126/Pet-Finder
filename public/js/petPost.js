$(document).ready(() => {
  // Gets an optional query string from our url (i.e. ?post_id=23)
  const url = window.location.search;
  let postId;
  // Sets a flag for whether or not we're updating a post to be false initially
  let updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In localhost:8080/cms?post_id=1, postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId);
  }
  // ---------------Have not changed code above this line to handle editing a new post ---------------

  // Getting jQuery references to the post inputs
  const petForm = $("#petForm");
  const titleInput = $("#title");
  const locationInput = $("#location");
  const phoneInput = $("#phone");
  const emailInput = $("#email");
  const bodyInput = $("#body");
  const petSelect = $("#petType");
  const rewardInput = $("#reward");
  // Giving the petSelect a default value
  petSelect.val("Other");
  // Adding an event listener for when the form is submitted
  $(petForm).on("submit", event => {
    event.preventDefault();
    console.log(event);
    // Wont submit the post if we are missing values in listed inputs
    if (
      !titleInput.val().trim() ||
      !locationInput.val().trim() ||
      !phoneInput.val().trim() ||
      !emailInput.val().trim() ||
      !bodyInput.val().trim() ||
      !petSelect.val().trim()
    ) {
      return;
    }
    // Constructing a newPost object to hand to the database
    const newPost = {
      title: titleInput.val().trim(),
      location: locationInput.val().trim(),
      phone: phoneInput.val().trim(),
      email: emailInput.val().trim(),
      body: bodyInput.val().trim(),
      petType: petSelect.val().trim(),
      reward: rewardInput.val().trim()
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
  // ---------------Have not changed code below this line to handle editing a new post ---------------

  // Gets post data for a post if we're editing
  function getPostData(id) {
    $.get("/api/posts/" + id, data => {
      if (data) {
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        postCategorySelect.val(data.category);
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
      window.location.href = "/blog";
    });
  }
});
