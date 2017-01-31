#!/bin/bash

printf "adding zips.json\n"
curl -X POST  --data-urlencode payload@../test/zips.json http://localhost:8080/add
printf " zips added\n"
curl -X POST http://localhost:8080/diff --data "_id=01001"
printf "\n"
