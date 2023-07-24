const newFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#blog-title').value.trim();
    //const needed_funding = document.querySelector('#project-funding').value.trim();
    const content = document.querySelector('#blog-content').value.trim();
  
    if (title && content) {
      const response = await fetch(`/api/blogs`, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/dashbord');
      } else {
        alert('Failed to create project');
      }
    }
  };
  
  const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/dashbord');
      } else {
        alert('Failed to delete blog');
      }
    }
  };

  async function updateBlog(blogId, updatedBlogData) {
    try {
      const response = await fetch(`/api/Blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlogData),
      });
      if (response.ok) {
        location.reload();
      } else {
        console.error('Failed to update the blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  }
  async function fetchBlogData(blogID) {
    const response = await fetch(`/api/Blogs/${blogID}`);
    if (response.ok) {
      const blogData = await response.json();
      const updatedBlogData = {
        ...blogData,
      };
      return updatedBlogData;
    } else {
      throw new Error('Failed to fetch blog data');
    }
  }
  async function editBlogForm(blogData) {
  // Get the existing Blog data
  const { id, title, content } = blogData;

  // Create the form element
  const form = document.createElement('form');
  form.id = 'editBlogForm';
  form.className = 'bg-white rounded p-4';

  // Create and append the Blog title input
// Create and append the Blog title input
const titleRow = document.createElement('div');
titleRow.className = 'row';
const titleFormGroup = document.createElement('div');
titleFormGroup.className = 'col-md-12 form-group';
const blogTitleLabel = document.createElement('label');
blogTitleLabel.textContent = 'Blog Title:';
const blogTitleInput = document.createElement('input');
blogTitleInput.type = 'text';
blogTitleInput.value = title;
blogTitleInput.className = 'form-control'; // Bootstrap form-control class
titleFormGroup.appendChild(blogTitleLabel);
titleFormGroup.appendChild(blogTitleInput);
titleRow.appendChild(titleFormGroup);
form.appendChild(titleRow);



// Create and append the Blog content input (using textarea)
const contentRow = document.createElement('div');
contentRow.className = 'row';
const contentFormGroup = document.createElement('div');
contentFormGroup.className = 'col-md-12 form-group';
const blogContentLabel = document.createElement('label');
blogContentLabel.textContent = 'Blog Content:';
const blogContentInput = document.createElement('textarea'); // Use textarea instead of input
blogContentInput.value = content;
blogContentInput.className = 'form-control'; // Bootstrap form-control class
blogContentInput.rows = 4; // Set the number of rows to adjust the height
contentFormGroup.appendChild(blogContentLabel);
contentFormGroup.appendChild(blogContentInput);
contentRow.appendChild(contentFormGroup);
form.appendChild(contentRow);



// Create the button group container
const buttonGroup = document.createElement('div');
buttonGroup.className = 'btn-group';

// Create the submit button
const submitButton = document.createElement('button');
submitButton.textContent = 'Update Blog';
submitButton.className = 'btn btn-primary mr-2 form-submit'; // Bootstrap btn and btn-primary classes
buttonGroup.appendChild(submitButton);

// Create the cancel button
const cancelButton = document.createElement('button');
cancelButton.textContent = 'Cancel';
cancelButton.className = 'btn btn-secondary form-cancel'; // Bootstrap btn and btn-secondary classes
buttonGroup.appendChild(cancelButton);

// Append the button group container to the form
form.appendChild(buttonGroup);
  // Append form to the popup window
  const popupWindow = document.getElementById('BlogPopupWindow'); // Update the ID to match the HTML
  popupWindow.innerHTML = '';
  popupWindow.appendChild(form);

  // Show the popup window
  popupWindow.classList.remove('hidden');

  // Set up event listener for form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Get the updated blog data from the form inputs
    const updatedBlogData = {
      title: blogTitleInput.value,
      content: blogContentInput.value,
    };
    console.log('update blog data ==--==');
    console.log(updatedBlogData);
    // Call a function to update the blog data on the server
    await updateBlog(id, updatedBlogData);

    // Close the popup window
    popupWindow.classList.add('hidden');
  });

  // Add event listener to the cancel button
  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    // Hide the form
    popupWindow.classList.add('hidden');
  });
}

    
  async function editBlog(blogID) {
    const blogData = await fetchBlogData(blogID);
    editBlogForm(blogData);
  }
 

  
  document
    .querySelector('.new-blog-form')
    .addEventListener('submit', newFormHandler);
  
  
  document
    .querySelector('.blog-list')
    .addEventListener('click', async (event) => {
      if (event.target.matches('.delete-blog-btn')) {
        delButtonHandler(event);
      } else if (event.target.matches('.edit-blog-btn')) {
        const blogID = event.target.dataset.updateId;
        editBlog(blogID);
      }
    });