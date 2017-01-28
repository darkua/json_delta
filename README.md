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

[ ] - endpoint to register model changes, receives individual entry or an array of them
  [ ] - add timestamp to entry for allow time filtering
  [ ] - store json entries in a simple key/value structure, ordered by timestamp

```
// if no interval is passed filter all
/diff -d {"start":"2017-01-01", end:"2017-01-01"} // all changes from all objects that occurend in between timeinterval
/diff/1 -d {"start":"2017-01-01", end:"2017-01-01"} //all changes for obj id 1, in between time interval
```
[ ] - endpoint to filter changes receiving as paramenter start and end date
  [ ] - get specific elements relative to the querie
  [ ] - diff in between ordered elements by date
  [ ] - output diff in correct format


Assumptions:
- Will use the field _id, to identify same objects for comparing
- stateless service, no cache, no data persistence


#questions:

As a a normal project, i would investigate and choose the best json diff lib available in order to take in consideration all possible cases, but since this is a code challange, you prefer me to me make a simple recursive transversal function that checks for, updates on values only (including nested objects and arrays), assuming that model does not change meaning no new/deleted keys?
