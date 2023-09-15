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
    - Allow users to register with an email and password.
  
2. **User Login**
    - Authenticate users and generate JWT tokens.
  
3. **Role-based Access Control**
    - Assign roles to users and restrict API access based on roles.

### User Management

1. **View Profile**
    - Allow users to view their own profile information.

2. **Update Profile**
    - Allow users to update their profile information.

3. **Delete Account**
    - Allow users to delete their account.

### Logs

1. **Create Log**
    - Allow users to create a new log entry.
  
2. **View Logs**
    - Retrieve logs based on different filters like log level.

3. **Delete Log**
    - Allow deletion of logs.

### Alerts

1. **Create Alert**
    - Allow users to create a new alert.
  
2. **View Alerts**
    - Retrieve alerts based on different filters like alert level.

3. **Delete Alert**
    - Allow deletion of alerts.

### Incidents

1. **Create Incident**
    - Allow users to report a new incident.
  
2. **View Incidents**
    - Retrieve incidents based on different filters like status.

3. **Update Incident**
    - Allow users to update the status and details of an incident.

4. **Delete Incident**
    - Allow deletion of incidents.

### Vulnerabilities

1. **Add Vulnerability**
    - Allow users to add a new vulnerability.
  
2. **View Vulnerabilities**
    - Retrieve vulnerabilities based on different filters like severity.

3. **Update Vulnerability**
    - Allow users to update the details of a vulnerability.

4. **Delete Vulnerability**
    - Allow deletion of vulnerabilities.

### Assets

1. **Add Asset**
    - Allow users to add a new asset.
  
2. **View Assets**
    - Retrieve assets based on different filters like type.

3. **Update Asset**
    - Allow users to update the details of an asset.

4. **Delete Asset**
    - Allow deletion of assets.

### Configurations

1. **Add Configuration**
    - Allow users to add a new configuration for an asset.
  
2. **View Configurations**
    - Retrieve configurations based on different filters.

3. **Update Configuration**
    - Allow users to update the details of a configuration.

4. **Delete Configuration**
    - Allow deletion of configurations.

[:point_up:](#table-of-contents)

---

## Advanced Cybersecurity API - Feature List

### Authentication and Authorization

1. **Multi-Factor Authentication (MFA)**
    - Utilize AWS Cognito for enhanced security through MFA.

### User Management

1. **User Behavior Analytics**
    - Use machine learning models via AWS SageMaker to analyze user behavior and flag suspicious activities.

### Logs

1. **Automated Log Analysis**
    - Use AWS Comprehend to perform sentiment analysis on logs to automatically categorize them.

### Alerts

1. **Real-time Alerting with AI**
    - Use AWS Lambda and SageMaker to send real-time alerts based on machine learning models that predict threat levels.

### Incidents

1. **Incident Forecasting**
    - Utilize AWS Forecast to predict future security incidents based on historical data.

2. **Automated Incident Resolution**
    - Use AWS Step Functions to automate the resolution of common incidents.

### Vulnerabilities

1. **Vulnerability Prediction**
    - Use AWS SageMaker to predict potential future vulnerabilities in the system.

### Assets

1. **Asset Recognition and Tagging**
    - Use AWS Rekognition to automatically recognize and tag different types of assets from images or videos.

### Configurations

1. **Automated Configuration Checks**
    - Use AWS Config to automatically check the security configurations of assets.

### AI-Driven Threat Hunting

1. **Threat Intelligence**
    - Use machine learning models on AWS SageMaker to analyze large datasets for potential threats.

2. **Natural Language Queries for Threats**
    - Utilize AWS Lex to allow users to query the system using natural language to find potential threats.

## Security Training

1. **Phishing Simulation**
    - Use AWS SageMaker to create a machine learning model that can simulate various types of phishing attacks for training purposes.

2. **Real-time Training Recommendations**
    - Use AWS Personalize to offer real-time training recommendations to users based on their behavior and role.

### Compliance

1. **Automated Compliance Reports**
    - Use AWS QuickSight to generate automated compliance reports.

2. **Compliance Forecasting**
    - Use AWS Forecast to predict future compliance risks.

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

- [ ] add auth layer (Clerk has some free tier limitations...)
- [ ] add Strange Beings phrase to English conversion
- [x] Use fastify route print out to automatically update README declaration of routes
- [ ] Use plugin docs to add swagger to autoload correctly with TS
- [ ] Find out which parts of Swagger files I do not need for dynamic generation of routes
- [ ] Improve logger at init and runtime
- [ ] Configure separate formatter for markdown
- [ ] Get custom domain to host Clerk services on Heroku

[:point_up:](#table-of-contents)
