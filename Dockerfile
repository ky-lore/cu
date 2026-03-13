# 1. Start from official Node image
FROM node:18

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package.json first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the app
COPY . .

# 6. Expose port
EXPOSE 3000

CMD ["node", "server.js"]