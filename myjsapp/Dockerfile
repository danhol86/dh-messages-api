# Use the official Node.js image as the base
FROM node:16.13.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Specify the default command to run when the container starts
CMD [ "node", "src/test.js" ]