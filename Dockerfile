FROM node:22.2.0

WORKDIR /app

COPY . /app

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm install -g @nestjs/cli

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]