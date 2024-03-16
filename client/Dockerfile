
FROM node:16


WORKDIR /usr/src/app
COPY  package*.json .
RUN npm install 
RUN npm install -g typescript 
COPY . . 

CMD [ "npm", "start"]




# FOR PRODUCTION , IT MUST BUILD THEN RUN 
# # Base image
# FROM node:16

# # Create app directory
# WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./


# # Install app dependencies
# RUN npm install

# # Bundle app source
# COPY . .


# # Creates a "dist" folder with the production build
# RUN npm run build

# # # Expose the port on which the app will run
# # EXPOSE 3001

# # Start the server using the production build
# CMD ["npm", "run", "start"]
