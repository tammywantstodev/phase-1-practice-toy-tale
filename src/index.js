let addToy = false;
const toyCollection = document.getElementById("toy-collection");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch toys and display them
  fetch('http://localhost:3000/toys')
      .then(res => res.json())
      .then(data => {
        data.forEach((toy) => {
          const name = document.createElement('h2');
          name.textContent = toy.name;

          const image = document.createElement('img');
          image.src = toy.image;
          image.classList.add('toy-avatar');

          const like = document.createElement('p');
          like.textContent = toy.likes;

          const button = document.createElement('button');
          button.textContent = 'Like';
          button.classList.add('like-btn');
          button.id = toy.id;

          button.addEventListener('click', () => handleLike(button, like));

          toyCollection.appendChild(name);
          toyCollection.appendChild(image);
          toyCollection.appendChild(like);
          toyCollection.appendChild(button);
        });
      });
});

document.getElementById("addToyBtn").addEventListener('click', createToy);

function createToy() {
  const nameInput = document.getElementById("name").value;
  const imageInput = document.getElementById("image").value;

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: nameInput,
      image: imageInput,
      likes: 0
    })
  })
      .then(res => res.json())
      .then(data => {
        const newToy = document.createElement('h2');
        newToy.textContent = data.name;

        const newImage = document.createElement('img');
        newImage.src = data.image;
        newImage.classList.add('toy-avatar');

        const newLike = document.createElement('p');
        newLike.textContent = data.likes;

        const newButton = document.createElement('button');
        newButton.textContent = 'Like';
        newButton.classList.add('like-btn');
        newButton.id = data.id;

        newButton.addEventListener('click', () => handleLike(newButton, newLike));

        toyCollection.appendChild(newToy);
        toyCollection.appendChild(newImage);
        toyCollection.appendChild(newLike);
        toyCollection.appendChild(newButton);
      })
      .catch(error => console.error('Error:', error));
}

function handleLike(button, likeElement) {
  const toyId = button.id; // Get the toy ID from the button
  const currentLikes = parseInt(likeElement.textContent); // Extract current likes from the DOM

  const updatedLikes = currentLikes + 1; // Increment likes

  // Update the DOM
  likeElement.textContent = updatedLikes;

  // Update the likes in the API
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: updatedLikes,
    }),
  })
      .then(res => res.json())
      .then(data => {
        console.log('Successfully updated likes on the server:', data);
      })
      .catch(error => console.error('Error updating likes:', error));
}
