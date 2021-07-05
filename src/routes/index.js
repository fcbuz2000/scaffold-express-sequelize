import users from './users.js';
// import tasks from './tasks.js';

export default (app) => {
  app.use('/api/users', users);
  // app.use('/api/user', tasks);
};
