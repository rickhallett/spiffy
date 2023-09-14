# Spiffy. Just practicing

## Table of Contents
- [Spiffy. Just practicing](#spiffy-just-practicing)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Getting Started](#getting-started)
  - [Swagger UI](#swagger-ui)
  - [Routes](#routes)
  - [TODO](#todo)

## About

Familiarising with the Fastify API framework, plugin ecosystem, Prisma ORM

## Getting Started

## Swagger UI

[Swagger UI](http://localhost:8080/docs/static/index.html#/default)

## Routes

```bash
└── /
    ├── docs (GET, HEAD)
    │   └── / (GET, HEAD)
    │       ├── static/
    │       │   ├── index.html (GET, HEAD)
    │       │   ├── swagger-initializer.js (GET, HEAD)
    │       │   └── * (HEAD, GET)
    │       ├── json (GET, HEAD)
    │       ├── yaml (GET, HEAD)
    │       └── * (GET, HEAD)
    ├── ping (GET, HEAD)
    ├── user (POST)
    ├── auth (GET, HEAD)
    └── todo (POST)
```


## TODO

1. index.html providing links to common routes, especially swagger ui
2. add auth layer
3. add Strange Beings phrase to English conversion
4. Full crud on User, Todo, StrangeBeings, Auth
5. Use fastify route print out to automatically update README declaration of routes
6. Use plugin docs to add swagger to autoload correctly with TS 
