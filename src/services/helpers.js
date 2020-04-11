export function getRandomRepositoryName() {

  const lessons = "01,02,03,04,05,06,07,08,09".split(',');
  const lesson = lessons[Math.floor(Math.random() * lessons.length)];
  
  const techs = ["reactjs", "react-native", "nodejs", "express", "mongo-db", "mongoose"];
  const tech = techs[Math.floor(Math.random() * techs.length)];
  
  return `gostack-lesson${lesson}-${tech}`;
}