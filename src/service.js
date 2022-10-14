import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const middlewares = jsonServer.defaults({
  logger: true, 
  noCors: true
});
const port = process.env.PORT || 5000;


server.use(jsonServer.rewriter({
  "/api/*": "/$1",
}));

const paginateResponseBody = (req, res, next) => {
  var oldSend = res.send;
  res.send = async function(data) {
    const params = new URLSearchParams(req.originalUrl.split('?').pop());
    const pageData = req.originalUrl === '/db' ? arguments[0] : await paginate(params, arguments[0]);
    arguments[0] = pageData;
    oldSend.apply(res, arguments);
  }
  next();
}
const compareValues = (key, order = 'asc') => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

const paginate = (params, data) => {
  const page = params.get('page') || params.get('currentPage') ||1;
  const pageSize = params.get('pageSize') || 10;

  const sort = params.get('sortBy');
  const order = params.get('orderBy') || 1;
  const dataArray = JSON.parse(data);
  
  const pageResponse = {
  }
  if(Array.isArray(dataArray)) {
    if(sort) {
      dataArray.sort(compareValues(sort, order > 0 ? 'asc':'desc'));
    }
    const dataLength = dataArray.length;
    pageResponse.data = dataArray;
    if(dataLength > pageSize) {
      const start = (page - 1 ) * pageSize;
      const end = page * pageSize - 1;
      pageResponse.data = dataArray.splice(start, end);
    }
    pageResponse.page = page;
    pageResponse.totalPages = Math.ceil(dataLength / parseInt(pageSize));
    pageResponse.pageSize = pageSize;
    pageResponse.totalRows = dataLength;
  }
  return JSON.stringify(pageResponse);
}

server.use(paginateResponseBody);

server.use(middlewares);
server.use(router);
server.listen(port);