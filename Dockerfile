FROM guergeiro/pnpm:20-8

# Definindo a variável de ambiente para a porta
ENV PORT 3000

# Definindo a variável de ambiente para o tamanho máximo de memória (8GB)
ENV NODE_OPTIONS=--max-old-space-size=8192

RUN npm install -g pnpm@9

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando o código fonte para o diretório de trabalho
COPY . /app

# Instalar dependências usando pnpm
RUN pnpm install

# Expondo a porta definida pela variável de ambiente
EXPOSE $PORT

# Comando para iniciar a aplicação
CMD ["sh", "-c", "pnpm start"]