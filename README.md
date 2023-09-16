# Spiffy. Just practicing

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
- [Cybersecurity API - MVP Feature List](#cybersecurity-api---mvp-feature-list)
- [Advanced Cybersecurity API - Feature List](#advanced-cybersecurity-api---feature-list)
- [Swagger UI](#swagger-ui)
- [Routes](#routes)
- [TODO](#todo)

---

## About

Familiarising with the Fastify API framework, plugin ecosystem, Prisma ORM

[:point_up:](#table-of-contents)

---

## Cybersecurity API - MVP Feature List

### Authentication and Authorization

1. **User Registration**
    - [x] Allow users to register with an email and password.
      
    ### User Login
    - [ ] Authenticate users and generate JWT tokens.
      
    ### Role-based Access Control
    - [ ] Assign roles to users and restrict API access based on roles.

    ### User Management
    - [x] Allow users to view their own profile information.
    - [x] Allow users to update their profile information.
    - [x] Allow users to delete their account.

    ### Logs
    - [x] Allow users to create a new log entry.
    - [ ] Retrieve logs based on different filters like log level.
    - [x] Allow deletion of logs.

    ### Alerts
    - [x] Allow users to create a new alert.
    - [ ] Retrieve alerts based on different filters like alert level.
    - [x] Allow deletion of alerts.

    ### Incidents
    - [x] Allow users to report a new incident.
    - [ ] Retrieve incidents based on different filters like status.
    - [ ] Allow users to update the status and details of an incident.
    - [x] Allow deletion of incidents.

    ### Vulnerabilities
    - [x] Allow users to add a new vulnerability.
    - [ ] Retrieve vulnerabilities based on different filters like severity.
    - [x] Allow users to update the details of a vulnerability.
    - [x] Allow deletion of vulnerabilities.

    ### Assets
    - [ ] Allow users to add a new asset.
    - [ ] Retrieve assets based on different filters like type.
    - [ ] Allow users to update the details of an asset.
    - [ ] Allow deletion of assets.

    ### Configurations
    - [x] Allow users to add a new configuration for an asset.
    - [ ] Retrieve configurations based on different filters.
    - [x] Allow users to update the details of a configuration.
    - [x] Allow deletion of configurations.

    ### Enhanced CRUD (**PRIORITY**)
    - [ ] Allow creation of Incidents, Vulnerabilities, Assets, and Configurations with both new and existing data entries

    [:point_up:](#table-of-contents)

    ---

    ## Advanced Cybersecurity API - Feature List

    ### Authentication and Authorization
    - [ ] Utilize AWS Cognito for enhanced security through MFA.

    ### User Management
    - [ ] Use machine learning models via AWS SageMaker to analyze user behavior and flag suspicious activities.

    ### Logs
    - [ ] Use AWS Comprehend to perform sentiment analysis on logs to automatically categorize them.

    ### Alerts
    - [ ] Use AWS Lambda and SageMaker to send real-time alerts based on machine learning models that predict threat levels.

    ### Incidents
    - [ ] Utilize AWS Forecast to predict future security incidents based on historical data.
    - [ ] Use AWS Step Functions to automate the resolution of common incidents.

    ### Vulnerabilities
    - [ ] Use AWS SageMaker to predict potential future vulnerabilities in the system.

    ### Assets
    - [ ] Use AWS Rekognition to automatically recognize and tag different types of assets from images or videos.

    ### Configurations
    - [ ] Use AWS Config to automatically check the security configurations of assets.

    ### AI-Driven Threat Hunting
    - [ ] Use machine learning models on AWS SageMaker to analyze large datasets for potential threats.
    - [ ] Utilize AWS Lex to allow users to query the system using natural language to find potential threats.

    ## Security Training
    - [ ] Use AWS SageMaker to create a machine learning model that can simulate various types of phishing attacks for training purposes.
    - [ ] Use AWS Personalize to offer real-time training recommendations to users based on their behavior and role.

    ### Compliance
    - [ ] Use AWS QuickSight to generate automated compliance reports.
    - [ ] Use AWS Forecast to predict future compliance risks.

    [:point_up:](#table-of-contents)

    ---

    ## Getting Started

    `npm start:dev` to start the server in development mode

    You'll need to be a repository collaborator for access to the mongoDB instance in the cloud.

    [:point_up:](#table-of-contents)

    ---

    ## Swagger UI

    [Swagger UI](http://localhost:8080/docs/static/index.html#/default)

    [^](#table-of-contents)

    ---

    ## Routes

    [Routes](./routes.txt)

    [:point_up:](#table-of-contents)

    ---

    ## TODO

    - [ ] PRIORITY: **encapsulate all CRUD routes into plugins**
    - [ ] add auth layer (Clerk has some free tier limitations...)
    - [ ] add Strange Beings phrase to English conversion
    - [x] Use fastify route print out to automatically update README declaration of routes
    - [ ] Use plugin docs to add swagger to autoload correctly with TS
    - [ ] Find out which parts of Swagger files I do not need for dynamic generation of routes
    - [ ] Improve logger at init and runtime
    - [ ] Configure separate formatter for markdown
    - [ ] Get custom domain to host Clerk services on Heroku

    [:point_up:](#table-of-contents)
