<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Ticketing App</h3>

  <p align="center">
    A Production-Ready Full-Stack App Powered by Event-Driven Microservices
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://34.8.203.13">View Live App</a>
    &middot;
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/othneildrew/Best-README-Template/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Architecture Diagram][architecture-diagram]](https://app.eraser.io/workspace/1GknkYSlKLSI33fC7iia)

This project is a full-stack, event-driven microservices-based platform that enables users to purchase event tickets and resell their owned tickets through an integrated auction system.
Here's some more details about the project:
- Built with a modular microservice architecture, where each core functionality (e.g., ticketing, bidding, authentication, ordering, payments) is encapsulated in its own service.
- Utilizes event-driven communication via a messaging system to enable decoupled and scalable interactions between services.
- Provides real-time bidding capabilities for authenticated users using WebSockets, ensuring a responsive and dynamic auction experience.
- Follows best practices in terms of reusablility, data consistency and security measures.
This platform is developed as a personal project to demonstrate hands-on expertise in building and deploying distributed systems using Microservices Architecture. While it captures the essence of a real-world ticketing and resale platform, some features have been simplified or abstracted to keep the focus on architectural concepts and technical implementation.
The project is deployed using Google Kubernetes Engine (GKE) in Autopilot mode, taking advantage of Google Cloud's managed infrastructure for scalability and resilience.

### Prerequisites
* npm
  ```sh
  npm install npm@latest -g
  ```
* docker-desktop
* skaffold
  ```sh
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
sudo install skaffold /usr/local/bin/
  ```
* kubernetes

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Harun-techie53/ticketing-app.git
   ```
2. Enter secret keys manifest  `./infra/k8s/secret.yaml`
   ```yaml
   apiVersion: v1
    kind: Secret
    metadata:
      name: cluster-secrets
    type: Opaque
    data:
      JWT_KEY: 'YOUR_BASE64_ENCODED_JWT_KEY'
      NEXT_PUBLIC_JWT_KEY: 'YOUR_BASE64_ENCODED_JWT_KEY_FOR_CLIENT'
      STRIPE_SECRET_KEY: 'YOUR_BASE64_ENCODED_STRIPE_SECRET_KEY'
      NEXT_PUBLIC_STRIPE_SECRET_KEY: 'YOUR_BASE64_ENCODED_STRIPE_SECRET_KEY_FOR_CLIENT'
      MONGO_URI_TICKETS: 'YOUR_BASE64_ENCODED_MONGO_URI'
      MONGO_URI_ORDERS: 'YOUR_BASE64_ENCODED_MONGO_URI'
      MONGO_URI_PAYMENTS: 'YOUR_BASE64_ENCODED_MONGO_URI'
   ```
3. Install RUN skaffold 
   ```sh
   skaffold dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[architecture-diagram]: images/architecture-diagram.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Tailwindcss]: https://img.shields.io/badge/tailwindcss-000000?style=for-the-badge&logo=tailwindcss
[Tailwindcss-url]: https://tailwindcss.com/
[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nodedotjs
[Node-url]: https://nodejs.org/en
[Express.js]: https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=expressdotjs&logoColor=white
[Express-url]: https://expressjs.com/
[Mongodb]: https://img.shields.io/badge/mongodb-000000?style=for-the-badge&logo=mongodb
[Mongo-url]: https://www.mongodb.com/
[NATS]: https://img.shields.io/badge/nats-000000?style=for-the-badge&logo=nats
[NATS-url]: https://nats.io/
[Redis]: https://img.shields.io/badge/redis-000000?style=for-the-badge&logo=redis
[Redis-url]: https://redis.io/
[Socket.io]: https://img.shields.io/badge/socket.io-000000?style=for-the-badge&logo=sockerdotio
[Socket-url]: https://socket.io/
[Kubernetes]: https://img.shields.io/badge/kubernetes-000000?style=for-the-badge&logo=kubernetes
[Kubernetes-url]: https://kubernetes.io/
[Docker]: https://img.shields.io/badge/docker-000000?style=for-the-badge&logo=docker
[Docker-url]: https://www.docker.com/
