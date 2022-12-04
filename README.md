# mock-api-service

### Build docker image
```
    docker build -t amitkshirsagar13/mock-api-service . 
    docker push amitkshirsagar13/mock-api-service 
```

### Run docker container
```
    docker run -d --name mock-api --rm -p 5000:5000 -e PORT=5000 amitkshirsagar13/mock-api-service
```

### Invoke api calls
- Query parameters
    - `page`
    - `pageSize`
    - `sortBy`
    - `orderBy` | values `1` or `-1`
    ```
    http://localhost:5000/products?&page=3&pageSize=10&sortBy=price&orderBy=-1
    ```

    http://localhost:4200/api/products?page=0&pageSize=10
    http://localhost:4200/api/products?page=3&pageSize=10

### Postal Api

[http://localhost:5000/api/postal/411033](http://localhost:5000/api/postal/411033)