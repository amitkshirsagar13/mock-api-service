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