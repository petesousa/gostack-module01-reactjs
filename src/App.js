import React, { useState, useEffect } from "react";

import api from './services/api'
import { getRandomRepositoryName } from './services/helpers';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleAddRepository() {
    const title = getRandomRepositoryName();
    const response = await api.post('repositories', {
      title,
      url: `https://github.com/petesousa/${title}`,
      techs: ["javascript", "nodejs"]
    });
    
    const repository = response.data;
    setRepositories([ ...repositories, repository]);
  }

  async function handleLikeRepository(id) {
    const likedRepo = await api.post(`repositories/${id}/like`);

    const newRepositoryList = repositories.map(r => r.id === id ? likedRepo.data : r);

    setRepositories(newRepositoryList);
  }

  function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`).then(() => {
      const newRepositoryList = repositories.filter(repository => repository.id !== id);
      setRepositories(newRepositoryList);
    });

  }

  return (
    <div className="App">
      <nav className="AddRepoNav">

        <button className="AddRepoButton" onClick={handleAddRepository}>Add</button>
      </nav>
      <ul className="RepoList" data-testid="repository-list">
        {
          repositories.map(repository => {
            const { id, title, techs, likes } = repository;
            const techCount = techs.length;
            return (
              <li key={id}>
                <span>
                  <h3 className="RepoTitle">{title}</h3>
                  <h4>
                    {
                      techs.map((tech, i) => {
                        const text = techCount === i + 1
                          ? `${tech}`
                          : `${tech}, `
                        return <span key={text}>{text}</span>
                      })
                    }
                  </h4>
                </span>
                <span className="Actions">
                  <button onClick={() => handleLikeRepository(id)}>
                    {likes === 1 ? `${likes} Like` : `${likes} Likes`}
                  </button>
                  <button onClick={() => handleRemoveRepository(id)}>Remove</button>    
                </span>
              </li>
            )
          })
        }
      </ul>

    </div>
  );
}

export default App;
