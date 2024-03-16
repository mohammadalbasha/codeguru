FROM node:16


WORKDIR /usr/src/app
COPY  package*.json .
RUN npm install 
RUN npm install -g typescript 
COPY . . 

CMD [ "npm", "start"]



# FOR PRODUCTION , IT MUST BUILD THEN RUN 