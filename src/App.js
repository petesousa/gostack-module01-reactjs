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

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`);

    const newRepositoryList = repositories.filter(repository => repository.id != id);
    setRepositories(newRepositoryList);
  }

  return (
    <div>
      <button onClick={handleAddRepository}>Adicionar</button>
      <ul data-testid="repository-list">
        {
          repositories.map(repository => {
            const { id, title } = repository;
            return (
              <li key={id}>
                <span>{title}</span>
                <button onClick={() => handleRemoveRepository(id)}>Remover</button>    
              </li>
            )
          })
        }
      </ul>

    </div>
  );
}

export default App;
