FROM golang:1.16

WORKDIR /app

COPY ./github.com/danhol86/dhmessagesapi .

RUN go mod download

WORKDIR /app

CMD [ "go", "test" ]