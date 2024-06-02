

FROM node:latest


# Set the working directory in the container
WORKDIR /usr/app


COPY . .

# Install dependencies
RUN npm install


# Expose the ports
EXPOSE 3000


# Command to run the react app
CMD ["npm", "start"]
