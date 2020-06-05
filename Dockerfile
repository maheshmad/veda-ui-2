#
#Intellect - Microservices Docker file for nxt gen portal ui service
#
# version  date         Updated By       Description
#---------------------------------------------------------------------------------------------------------------    
# v1.0     Aug-2019     Mahesh M         Initial create, builds a base image from official httpd alpine
#                                           
# 
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save vue-typer \
    && npm install --save @fortawesome/fontawesome-free 
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/nxt-gen-portal
EXPOSE 8078
CMD ["nginx", "-g", "daemon off;"]
