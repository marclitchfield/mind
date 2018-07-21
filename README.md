# Mind

### Prerequisites
* Docker
* docker-compose

### Setup

Run docker-compose:
```
docker-compose up -d
```

Then initialize the database
```
docker-compose run api npm run seedDb
```

App endpoint: http://localhost:4000/
GraphQL: http://localhost:5000/
Neo4j Browser: http://localhost:7474/browser/
