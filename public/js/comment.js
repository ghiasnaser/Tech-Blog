document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comments_form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); 
  
      const formData = new FormData(form);
      const blogId = formData.get('blog_id');
      const commentContent = formData.get('comment_content');
      
      try {
        const response = await fetch(`/api/Comments/${blogId}`, {
          method: 'POST',
          body: JSON.stringify({ comment_content: commentContent }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const commentId = data.commentId;
          console.log(data);
          if (commentId) {
            const commentElement = document.getElementById(`comment-${commentId}`);
            if (commentElement) {
              commentElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
  
          // Reload the page to see the new comment
          window.location.reload();
        } else {
          console.log('Error adding comment');
        }
      } catch (err) {
        console.log(err);
      }
    });
  
  // Select all the buttons containers
  const buttonsContainers = document.querySelectorAll('.buttons-container');
  const currentUserId = document.getElementById('current-user').dataset.userId;
  const blogOwnerId=document.getElementById('bolg-owner').dataset.userId;
  
  // Iterate over each buttons container and check if the current user is the owner
  buttonsContainers.forEach(container => {
      const commentOwnerId = container.dataset.userId;
  
      // Get the delete and update buttons within this container
      const deleteButton = container.querySelector('.delete-button');
      const updateButton = container.querySelector('.update-button');
      if (commentOwnerId === currentUserId){
        deleteButton.style.display = 'block';
        updateButton.style.display = 'block';
      }
      if(blogOwnerId === currentUserId && commentOwnerId != currentUserId){
        deleteButton.style.display = 'block';
      }
    });
  });
  
  
  const blogId=document.getElementById('blog-container').dataset.blogId;
  
  async function handleDelete(event) {
    const commentId = event.target.dataset.commentId;
  
    try {
      const response = await fetch(`/api/Comments/${blogId}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete comment');
      }
  
      // If the deletion is successful, you can remove the comment element from the DOM
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement) {
        commentElement.remove();
      }
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  }
  
  // Function to handle the update button click
  async function handleUpdate(event) {
    const commentId = event.target.dataset.commentId;
    const newCommentContent = prompt('Enter new comment content:');
  
    if (newCommentContent === null || newCommentContent.trim() === '') {
      return; // User canceled the update or provided an empty comment
    }
  
    try {
      const response = await fetch(`/api/Comments/${blogId}/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment_content: newCommentContent }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update comment');
      }
  
      // If the update is successful, you can update the comment content on the page
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement) {
        const commentContentElement = commentElement.querySelector('h6');
        if (commentContentElement) {
          commentContentElement.textContent = newCommentContent;
        }
      }
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  }
  
  
  // Add event listener for the "Delete" and "Update" buttons using event delegation
  document.querySelector('.comments-box').addEventListener('click', function(event) {
    if (event.target.matches('.delete-button')) {
      handleDelete(event);
    } else if (event.target.matches('.update-button')) {
      handleUpdate(event);
    }
  });