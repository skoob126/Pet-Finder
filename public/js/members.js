$(document).ready(() => {
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
});
