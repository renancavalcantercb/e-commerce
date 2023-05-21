
# E-commerce Fullstack Project

This is a fullstack e-commerce project that includes a React front-end, a Flask back-end, and a MongoDB Atlas database. The project is containerized using Docker Compose for easy deployment and management of both services.

## Technologies Used

- Front-end: React, Yarn, Tailwind CSS
- Back-end: Flask
- Database: MongoDB Atlas
- Deployment: Docker Compose
  
## Prerequisites
  
Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org) - JavaScript runtime environment
- [Yarn](https://yarnpkg.com) - Dependency management for the front-end
- [Python](https://www.python.org) - Programming language used by Flask
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Managed MongoDB database service
- [Docker](https://www.docker.com) - Containerization platform for deployment

  

## Installation

1. Clone the repository:

	```bash
	git clone https://github.com/renancavalcantercb/e-commerce/
	```

  

2. Install the dependencies for the front-end:

  

	```bash
	cd  e-commerce
	cd  frontend
	yarn  install
	```

  

3. Install the dependencies for the back-end:

	```bash
	cd ..
	cd backend
	pip install -r requirements.txt
	```
	
4. Configure environment variables:

- Generate a secret key for the Flask application. Open a terminal and run the following command:

	```bash
	python -c 'import os; print(os.urandom(16))'
	```	
	Copy the output generated by the command.
	
- Create a .env file in the backend directory of the project.
- Open the .env file and add the following environment variables:

	```bash
	SECRET_KEY=<your_secret_key>
	MONGO_URI=<your_mongo_atlas_uri>
	```
	
	Replace <your_secret_key> with the copied secret key and <your_mongo_atlas_uri> with the URI for your MongoDB Atlas cluster.

5. Start the application using Docker Compose:

	```bash
	docker-compose up
	```
	This command will start the front-end and back-end services in detached mode.
	
6. Access the application:
	Open your web browser and visit `http://localhost:3000` to access the e-commerce application.

## Usage

- The front-end React application will be running on `http://localhost:3000`.
- The back-end Flask API will be running on `http://localhost:5000`.

Feel free to explore and interact with the e-commerce application through the front-end interface.

## Acknowledgments

- [React](https://reactjs.org)
- [Yarn](https://yarnpkg.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Flask](https://flask.palletsprojects.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Docker Compose](https://docs.docker.com/compose)
