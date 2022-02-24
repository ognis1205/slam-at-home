Express/Node.js Signaling Server
==============================

express-signaling: Express/Node.js Based Signaling Server for WebRTC.

Setting up Project
------------
 0. If you want to run the development server, simply run the following command in the project root directory:
 
 ```bash
 $ npm run dev
```
 
 1. Run the following command in the project root directory to install dependencies:

```bash
 $ npm install
```

 2. After the installation, you can start the server by the following command in the project root directory:
 
 ```bash
 $ npm start
```

Deployment
------------
You can create the [Docker](https://www.docker.com/) image of the application with the [Dockerfile](./Dockerfiles/Dockerfile).

 1. Run the following command in the project root directory to install dependencies:

```bash
 $ docker build -t NAME[:TAG] -f Dockerfiles/Dockerfile .
```

2. After the image build, you can start the service by the following command:

 ```bash
 $  docker run -p EXTERNAL_PORT:INTERNAL_PORT --env PORT=INTERNAL_PORT NAME[:TAG]
```
