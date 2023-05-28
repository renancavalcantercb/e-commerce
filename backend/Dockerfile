# Use a imagem base do Python
FROM python:3.11

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências
RUN pip install -r requirements.txt

# Copia o código-fonte do Flask para o diretório de trabalho
COPY . .

# Define a porta que será exposta
EXPOSE 5000

# Comando para iniciar o servidor Flask
CMD ["uwsgi", "app.ini"]
