const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
 const { title, url, techs } = request.body;

 const repository = {
   id: uuid(),
   title,
   url,
   techs,
   likes: 0,
 }

 repositories.push(repository);

 return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findeRepositoryIndex = repositories.findIndex(repository => 
    repository.id === id
   );

   if(findeRepositoryIndex === -1){
    return response.status(400).json({ error: "Repository does not exists."});
  }

   const repository ={
    id,
    title,
    url,
    techs,
    likes:repositories[findeRepositoryIndex].likes,
  }
 

   repositories[findeRepositoryIndex] = repository;

   return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
   const { id } = request.params;

   const findeRepositoryIndex = repositories.findIndex(repository => 
      repository.id === id
     );

     if(findeRepositoryIndex >=0){
       repositories.splice(findeRepositoryIndex, 1);
     }else{
       return response.status(400).json({error: "Repository does not exists."});
     }

     return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //verifica se o repository existe
  const findeRepositoryIndex = repositories.findIndex(repository => 
    repository.id === id
   );

  //se ele não existir, manda o error 400
  if(findeRepositoryIndex === -1){
    return response.status(400).json({ error: "Repository does not exists."});
  }

  repositories[findeRepositoryIndex].likes +=1;

  return response.json(repositories[findeRepositoryIndex]);

});

module.exports = app;
