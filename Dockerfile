# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (hier: 3000, kann angepasst werden)
EXPOSE 3000

# Command to run the app
CMD [ "npm", "start" ]
