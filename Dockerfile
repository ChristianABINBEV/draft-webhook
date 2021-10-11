#############################################################
# DockerFile Webhook
#############################################################

# Imagen Base
FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy env file
COPY .env /usr/src/app/

# Install app dependencies
COPY package*.json tsconfig*.json ./
RUN npm install --quiet

# Copy the rest of the application source code to the container
COPY src/ src/

# Transpile typescript and bundle the project
RUN npm run build

# Remove the original src directory (our new compiled source is in the `dist` folder)
RUN rm -r src

# Port to work
EXPOSE 3001

# Run App
CMD ["npm", "run", "start:prod"]