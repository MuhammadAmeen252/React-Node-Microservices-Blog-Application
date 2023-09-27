# React & Node Microservices Blog Application

This is a simple microservices-based application that allows you to create posts, view all posts, comment on posts, and view comments on each post. The application uses REST APIs for communication between different services and employs various tools and technologies such as Docker, Kubernetes, pods, Node.js, deployments, services, Ingress-nginx, Load Balancers, and Skaffold.

## Services

### Client
The client is a React application with Bootstrap for design. It serves as the user interface for creating and viewing posts and comments.

### Query
The query service provides listings of posts and comments, caching them for instant retrieval. It handles two route handlers:
- `/posts` (GET): Provides listings of comments and posts.
- `/events` (POST): Receives events from the event bus and stores them in an accessible data structure.

### Event Bus
The event bus service sends event requests to other services, informing them of occurred events. It also saves these events, enabling event processing even if the server is temporarily down.

### Posts
The Posts service handles the creation of new posts, fetching post lists, and all post-related operations.

### Comments
The Comments service manages the creation and modification of comments on posts, as well as fetching comment lists and other comment-related operations.

### Moderation
The Moderation service is responsible for comment moderation. It verifies comments and sets their status to approved or rejected. If the moderation service is unavailable, comments are marked as pending. It handles all events related to comment moderation.

### infra/k8s
This directory contains configurations related to clusters, services, and deployments. The `scaffold.yaml` file in the root directory can be run using `skaffold dev`, which builds and deploys all services, updating them if code changes occur.

## Ports Used
- Client: 3000
- Posts Service: 4000
- Comments Service: 4001
- Event Bus Service: 4005
- Query Service: 4002
- Moderation Service: 4003

## Application Workflow

### Creating a New Post
1. When a new post is created, the client sends a request to the Posts service.
2. The Posts service saves the post and sends a "PostCreated" event to the Event Bus service.
3. The Event Bus service informs all services (Posts, Comments, Query, and Moderation) about the new post.
4. Posts, Comments, and Moderation services respond with empty responses.
5. The Query service saves the post in a data structure for caching and sends an empty response.

### Fetching Posts & Comments
- The client fetches posts and comments by sending GET requests to the Query service, which responds with data retrieved from the cached data structure.

### Creating & Modifying Comments on Posts
1. When a client creates a new comment, it sends a POST request to the Comment service.
2. The Comment service saves the comment in its database with a "pending" status and sends a "CommentCreation" event to all services.
3. Posts and Comments services respond with empty responses.
4. The Query service saves the comment in the corresponding post's data structure and sends an empty response.
5. The Moderation service checks the comment's validity (e.g., if it contains the word "orange"). If valid, it sets the status to approved; otherwise, it marks it as rejected.
6. The Moderation service sends a POST request to the Event Bus to inform all services about the comment modification.
7. Posts and Moderation services respond with empty responses.
8. Comments and Query services update the comment status based on the received "CommentModified" event.

## Benefits of Using Microservices, Kubernetes, Pods, and Deployments
1. Scalability:
Microservices architecture allows you to scale individual services independently based on their workload. You can allocate more resources to services that require it, ensuring optimal performance and resource utilization.
2. Fault Isolation:
With microservices, a failure in one service does not affect the entire application. Services are isolated, making it easier to identify and fix issues without impacting the entire system.
3. Continuous Deployment:
Kubernetes and deployments enable you to implement continuous deployment practices. You can roll out updates, new features, and bug fixes seamlessly, reducing downtime and ensuring a smoother user experience.
4. Resource Efficiency:
Kubernetes efficiently manages containerized applications, optimizing resource utilization. Pods are scheduled on nodes with available resources, ensuring efficient use of compute resources.
5. High Availability:
Kubernetes provides features like automatic scaling, load balancing, and failover mechanisms that enhance application availability. It can replace failed containers or pods automatically, minimizing service disruption.
6. Improved Resource Utilization:
Kubernetes can horizontally scale pods across multiple nodes, distributing the workload evenly and preventing resource bottlenecks.
7. Rolling Updates and Rollbacks:
Deployments in Kubernetes allow you to perform rolling updates, gradually replacing old versions with new ones. If an issue is detected, rollbacks can be executed quickly to revert to a stable version.
8. Resource Monitoring:
Kubernetes provides tools for resource monitoring and performance analysis, helping you identify and address performance bottlenecks and resource constraints.
9. Cost Efficiency:
Microservices and Kubernetes enable cost-effective resource allocation. You can scale up or down based on demand, avoiding overprovisioning and reducing infrastructure costs.
10. Enhanced Development Velocity:
Microservices promote faster development cycles. Smaller, independent teams can work on specific services, allowing for rapid feature development and updates.
11. Flexibility and Technology Diversity:
Microservices architecture allows you to use different technologies and programming languages for each service, enabling you to choose the best tools for specific tasks.

