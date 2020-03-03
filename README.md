# ArcGIS GeoJSON connector for Elasticsearch

## What is it ?
ArcGIS GeoJson connector for Elasticsearch is an ETL. It provides three capabilities: 
- visualize data from Elasticsearch in a Esri web application
- query data from Elasticsearch from a Esri web application
- add data from Elasticsearch from a Esri web application

## How it works ?
The core of ArcGIS GeoJson connector for Elasticsearch is node.js. It provide an APIs mapping beetwen ArcGIS API Rest and Elasticsearch API REST. Another component is deployed with node: redis. Redis is an in-memory data structure store, used as a database, cache and message broker. Thanks to redis, we store data like schema of the Elasticsearch index.

## What do you need to test it ?
You need to:
- install Elasticsearch. You can use docker and the official image. => https://hub.docker.com/_/elasticsearch 
- install Redis. See => https://redis.io/ . You can use docker too => https://hub.docker.com/_/redis/ 
- clone this repositery

## Installation ?
Install the depencies with :

```shell
$ npm install
```
Then you have to configure the config.json file in the src folder. Types the different parameters to access Elasticsearch, redis and configure your http server.

We have 3 main scripts:

- dev : start http server for developement

```shell
$ npm run dev
```

build : build the project, TypeScript to JavaScript in a dist folder (you can change it in tsconfig.json)

```shell
$ npm run build
```

start : start the http server from the builded project directory

```shell
$ npm run start
```

## How use it with ArcGIS API for JavaScript
You can call REST endpoints with GeoJSON Class. You can apply renderer too.

```javascript
const geojson = new GeoJSONLayer({
    url: 'HOST:PORT/INDEXNAME/SEARCH'
})
```


## TODO
- update data
- delete data
- authentification
- metadata
- https
- Dockerfile