import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const middlewares = jsonServer.defaults({logger: true, noCors: true});
const port = process.env.PORT || 5000;


server.use(jsonServer.rewriter({
  "/api/*": "/$1",
}));
server.use(middlewares);
server.use(router);
server.listen(port);