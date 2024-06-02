# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install dependencies
RUN npm install


# Expose the ports
EXPOSE 5001

# Command to run the Node.js server
CMD ["node", "src/server.js"]
