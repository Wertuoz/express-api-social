# Using image Linux Alpine with node version 14
FROM node:19.5.0-alpine

# Setup work dir
WORKDIR /app

# Copy package.json and package-lock.json files inside the container
COPY package*.json ./

#Installl dependencies for the project
RUN npm install

# Copy other files and folders inside the container
COPY . .

# Installing Prisma
RUN npm install -g prisma

# Generate Prisma Client
RUN prisma generate

# Copy the Prisma Client to the container
COPY prisma/schema.prisma ./prisma/

# Open port 3000 to the outside world
EXPOSE 3000

# Start the application
CMD ["npm", "start"]