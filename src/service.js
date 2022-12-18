import jsonServer from 'json-server';
import path from 'path';
import multer  from 'multer';
import {postalRoute} from './routes/postal-route';
import fs from 'fs';


const port = process.env.PORT || 5000;

const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `db/${file.fieldname}`;
    cb(null, path.join(__dirname, destination));
    if (!fs.existsSync(destination)){
      fs.mkdirSync(destination);
    }
  },
  filename: function (req, file, cb) {
    const fileName =  Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'));
    req['filePath'] = `/api/download/${file.fieldname}/${fileName}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage })

const server = jsonServer.create();

const router = jsonServer.router('./db/db.json');

const middlewares = jsonServer.defaults({
  logger: true, 
  noCors: true
});

server.use('/api/postal/:pincode', postalRoute.fetchPincode);


server.use(jsonServer.rewriter({
  "/api/*": "/$1",
}));

const paginateResponseBody = (req, res, next) => {
  const oldSend = res.send;
  if(req.files?.length > 0) {
    const filePath = req.filePath;
    res.send = function() {
      arguments[0] = JSON.stringify({filePath});
      oldSend.apply(res, arguments);
    }
  } else {
    res.send = async function(data) {
      const params = new URLSearchParams(req.originalUrl.split('?').pop());
      const pageData = req.originalUrl === '/db' ? arguments[0] : await paginate(params, arguments[0]);
      arguments[0] = pageData;
      oldSend.apply(res, arguments);
    }
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
  const page = parseInt(params.get('page') || params.get('currentPage') || 1);
  const pageSize = parseInt(params.get('pageSize') || 10);

  const sort = params.get('sortBy');
  const order = params.get('orderBy') || 1;
  let dataArray = JSON.parse(data);
  
  const pageResponse = {};
  if(Array.isArray(dataArray)) {
    dataArray = dataArray.filter(row=> Object.keys(row).length > 1 && Object.keys(row).includes('id'))
    if(sort) {
      dataArray.sort(compareValues(sort, order > 0 ? 'asc':'desc'));
    }
    const dataLength = dataArray.length;
    pageResponse.data = dataArray;
    if(dataLength > pageSize) {
      const start = (page - 1 ) * pageSize;
      const end = page * pageSize;
      pageResponse.data = dataArray.slice(start, end);
    }
    pageResponse.page = page;
    pageResponse.totalPages = Math.ceil(dataLength / parseInt(pageSize));
    pageResponse.pageSize = pageSize;
    pageResponse.totalRows = dataLength;
  }
  return JSON.stringify(pageResponse);
}

server.use('/download/:store/:id', function(req, res){
  const file = `${__dirname}/db/${req.params.store}/${req.params.id}`;
  res.download(file); // Set disposition and send it.
});



server.use(middlewares);
server.use(upload.any());
server.use(paginateResponseBody);
server.use(router);
server.listen(port);