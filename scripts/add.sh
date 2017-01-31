#!/bin/bash
curl -X POST http://localhost:8080/add --data "payload=`cat ../test/array_entry.json`"