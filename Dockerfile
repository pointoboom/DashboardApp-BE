FROM node:18
WORKDIR /app
COPY . /app
# COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD [ "npm","start" ]