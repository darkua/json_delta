-Json Delta service

This exercise is from an actual report on ClanHR. The objective is to build
a service that tracks model changes and lists them. The service will receive
two user versions, as json:

```json
// old
{"_id": 1,
 "name": "Bruce Norries",
 "address": {"street": "Some street"}}

// new
{"_id": 1,
 "name": "Bruce Willis",
 "address": {"street": "Nakatomi Plaza"}}
```

Note that these json bags can be big and with several nested objects.

After that, a listing endpoint should be made available that returns a
collection of data in the form:

```json
[{"field": "name", "old": "Bruce Norris", "new": "Bruce Willis"},
 {"field": "address.street", "old": "Some Street", "new": "Nakatomi Plaza"}]
```

Note that the listing should be filtered by start date and end date, and that
we only want a change per user/field on that timespan. So for the given events:

```
March: Name from A to B
March: Name from B to C
June: Name from C to D
```

If we filter for March, we should get only one change:

```json
[{"field": "name", "old": "A", "new": "C"}]
```

### Wrap-up

Create two endpoints, one to register json model the changes, and another to list
the changes based on a start/end date filter.


```
/add {"id":1,"name":"foo"} 
/add [{"id":1,"name":"bar"},{"id":2,"name":"foobar"}]
```

* endpoint to register model changes, receives individual entry or an array of them
  - [x] add timestamp to entry for allow time filtering
  - [x] store json entries in a simple key/value structure, ordered by timestamp

```
// if no interval is passed filter all
/diff -d {"start":"2017-01-01", end:"2017-01-01"} // all changes from all objects that occurend in between timeinterval
/diff -d {"_id":1,start":"2017-01-01", end:"2017-01-01"} //all changes for obj id 1, in between time interval
```
* endpoint to filter changes receiving as paramenter start and end date
  - [ ] get specific elements relative to the time query
  - [ ] diff in between ordered elements by date
  - [ ] output diff in correct format

Assumptions:
- Will use the field _id, to identify same objects for comparing
- Will user the field _timestamp, to identify object change, if not present will add to object
- stateless service, no cache, no data persistence

* todo
  - [] using a for loop to add multiple items in array creates entries with same timestamp, since js only has resolution to miliseconds, one solution could be add process.hrtime() with micro resolution as padding


### Running locally
```
npm install
npm test 
npm start
```

or using docker
```
docker pull darkua/json-delta
```

Go into scripts dir and you can run ./add.sh to register data, and you cand diff the data running ./diff.sh
I add benchmarck script to add a large json file, and diff the contents
```timer ./benchmark.sh```