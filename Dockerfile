# Dockerfile
FROM node:20
WORKDIR /

# Install dotenvx
RUN curl -fsS https://dotenvx.sh/ | sh

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

# CMD ["dotenvx", "run",  "--env-file=.env.production", "--", "node", "app.js"]

# Prepend dotenvx run
CMD ["dotenvx", "run",  "--env-file=.env.production", "--", "node", "app.js"]