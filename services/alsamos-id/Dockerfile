FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /out/alsamos-id .

FROM alpine:3.20
RUN adduser -D -H -s /sbin/nologin app
USER app
COPY --from=build /out/alsamos-id /alsamos-id
EXPOSE 8080
ENTRYPOINT ["/alsamos-id"]
