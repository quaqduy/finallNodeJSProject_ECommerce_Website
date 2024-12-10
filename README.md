# finallNodeJSProject_ECommerce_Website

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- Docker
- Docker Compose

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/finallNodeJSProject_ECommerce_Website.git
   cd finallNodeJSProject_ECommerce_Website

2. **Create a .env file in the root directory with the following contents:**

    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_CLUSTER=your_db_cluster
    DB_NAME=EcommerceDB

Replace your_db_user, your_db_password, and your_db_cluster with your actual MongoDB credentials.

3. **Build and start the project using Docker Compose:**

    docker-compose up --build

    This will build the Docker image and start the services defined in the docker-compose.yml file. The application should be accessible at http://localhost:8386.

## Project Structure

- app.js: Main application file.
- routes: Contains route definitions.
- models: Contains Mongoose models.
- views: Contains EJS templates.
- public: Contains static assets like CSS, JavaScript, and images.

## Usage

- Access the application: Open your web browser and navigate to http://localhost:8386.
- Admin Dashboard: Access the admin dashboard at http://localhost:8386/admins/dashboard.

## Features

- User authentication and authorization
- Product listing and details
- Shopping cart and checkout
- Order management
- Admin dashboard with analytics