// Reference to HTML elements
const searchForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');
const toggleSearchTypeButton = document.getElementById('toggle-search-type');

let searchType = "user"

// Event listener for the search form
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
        // Clear previous results
        userList.innerHTML = '';
        reposList.innerHTML = '';

         if(searchType=="user"){
            searchGitHubUser(searchTerm)
         }else{
            searchGitHubRepo(searchTerm)
         }
    }
});
// Event listener for the "Toggle Search Type" button
toggleSearchTypeButton.addEventListener('click', function () {
    if (searchType === 'user') {
        searchType = 'repo';
        toggleSearchTypeButton.textContent = 'Search Users';
        searchInput.placeholder = 'Search GitHub Repositories';
    } else {
        searchType = 'user';
        toggleSearchTypeButton.textContent = 'Search Repositories';
        searchInput.placeholder = 'Search GitHub Users';
    }
});
// Function to search GitHub users
const searchGitHubUser = function(query) {
    fetch(`https://api.github.com/search/users?q=${query}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => {
            console.error('Error searching GitHub users:', error);
        });
}

// Function to search GitHub repo
const searchGitHubRepo = function(query) {
    fetch(`https://api.github.com/search/repositories?q=${query}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // displayRepos(data.items)
            displayRepos(data.items)
        })
        .catch(error => {
            console.error('Error searching GitHub users:', error);
        });
}
// Function to display GitHub users
function displayUsers(users) {
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" width="100">
            <h2>${user.login}</h2>
            <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        userList.appendChild(userCard);

        // Add a click event to each user card to load their repositories
        userCard.addEventListener('click', () => {
            loadUserRepos(user.login);
        });
    });
}


// function displayRepos(repos) {
//     resultsContainer.innerHTML = '';
//     repos.forEach(repo => {
//         const repoList = document.createElement('ul');
//         repos.forEach(repo => {
//             const repoItem = document.createElement('li');
//             repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
//             repoList.appendChild(repoItem);
//         });
    
//         reposList.appendChild(repoList);
//     });
// }

// Function to load a user's repositories
function loadUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            displayRepos(data);
        })
        .catch(error => {
            console.error('Error loading user repositories:', error);
        });
}

// Function to display user repositories
function displayRepos(repos) {
    reposList.innerHTML = '';
    if (repos.length === 0) {
        reposList.textContent = 'No repositories found for this user.';
        return;
    }

    const repoList = document.createElement('ol');
    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        repoList.appendChild(repoItem);
    });

    reposList.appendChild(repoList);
}
