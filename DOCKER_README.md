# Docker Usage Guide for Fable Weaver

This guide explains how to use Docker to build, run, and develop the Fable Weaver application. The project is set up to use `pnpm` scripts to manage Docker commands, providing a streamlined workflow without the need for `docker-compose` or complex command-line instructions.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed and running on your machine.

## Available Scripts

The following scripts are available in `package.json` to interact with Docker:

### Building the Image

To build the Docker image for the application, run:

```bash
pnpm run docker:build
```

This command executes `docker build -t fable-weaver .`, creating a Docker image with the tag `fable-weaver`.

### Running the Application

Once the image is built, you can run the application in a container with:

```bash
pnpm run docker:run
```

This will start a container, and the application will be accessible at [http://localhost:5173](http://localhost:5173). This command runs the production-ready build of the application.

### Development with Hot-Reloading

For development, you can run the application in a container with hot-reloading enabled. This allows you to make changes to the code on your local machine and see them reflected in the running container instantly.

**For Windows:**

```bash
pnpm run docker:watch:run
```

**For macOS and Linux:**

The `docker:watch:run` script in `package.json` is configured for Windows (`%cd%`). For macOS and Linux, you can run the equivalent command directly:

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules fable-weaver
```

This command mounts your current working directory into the container, allowing for live code updates.

### Managing Containers

- To list all running containers:
  ```bash
  pnpm run docker:list
  ```
- To list all containers, including stopped ones:
  ```bash
  pnpm run docker:list-all
  ```

## Using the Pre-built Image from Docker Hub

A pre-built image is available on Docker Hub at `4ssh1/fable-weaver`. You can pull and run this image directly without building it locally.

To pull the image:

```bash
docker pull 4ssh1/fable-weaver:latest
```

To run the pre-built image:

```bash
docker run -p 5173:5173 4ssh1/fable-weaver:latest
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## Publishing Your Own Image

If you want to publish your own version of the image to Docker Hub, you can use the `docker:publish` script. First, log in to Docker Hub:

```bash
pnpm run docker:login
```

Then, update the `docker:publish` script in `package.json` with your Docker Hub username and run:

```bash
pnpm run docker:publish
```
