### Why asynchronousity?
- App initial startup
- Components nature
- Data access
- Animation
- User interaction

### Async problems:
- Memory leaks
- Race conditions
- Callback hell
- Complex state machines
- Error handling

```
function playMovie(movieId, cancelButton, callback) {
	var movieAuthTicket;
	var playerError;
	var tryPlaying = function () {
		if(playerError) {
			callback(null, playerError);
		} else {
			callback(null, movieAuthTicket);
		}
	};

	cancelButton.addEventListener('click', function() {
		playerError = 'cancelled';
	});

	if(!player.initialized) {
		player.init(function(error) {
			playerError = error;
			tryPlaying();
		});
	}

	authorizeMovie(function(error, ticket) {
		playError = error;
		movieAuthTicket = ticket;
		tryPlaying();
	});
}
```


Gang of Four
Design pattern relationship
Iterator vs Observer

Iterator: Producer producing data and passing it to consumer one at a time.
Consumer asks Producer for an iterator and pulls one data item at a time.

Iterator Pattern:
var iterator = getNumber();
console.log(iterator.next());
{ value: 1, done: false }
console.log(iterator.next());
{ value: 2, done: false }
console.log(iterator.next());
{ value: 3, done: false }
console.log(iterator.next());
{ done: true }

Observer Pattern:
document.addEventListener('mousemove', function next(e) {
	console.log(e);
});

{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }
{ clientX: 200, clientY: 400 }

Here is producer is in control. Producer is iterating and pushing data onto consumer. Consumer sends a callback to Producer so that it can push data to it by calling it.

GOF left one principle in observer pattern of producer conveying consumer no more data.


Difference btn arrays and events:
collections

Async programming becomes so easy

ES6 Arrow function:
function (x) {return x + 1; }
function (x, y) {return x + y; }

x => x + 1
(x, y) => x + y

forEach:
[1,2,3].forEach(x => console.log(x));

map:
[1,2,3].map(x => x + 1)
[2,3,4]

filter:
[1,2,3].filter(x => x > 1)
[2,3]

concatAll:
[[1], [2,3], [], [4]].concatAll();
[1,2,3,4]


Top rated movies collection:
var getTopRatedFilms = user =>
	user.videoLists.
		map(videoList => 
			videoList.videos.
				filter(video => video.rating === 5.0)).
		concatAll();

getTopRatedFilms(user).
	forEach(film => console.log(film));


Mouse Drags Collection:
var getElementDrags = elmt =>
	elmt.mouseDowns.
		map(mouseDown => 
			document.mouseMoves.
				takeUntil(document.mouseUps)).
		concatAll();

getElementDrags(image).
	forEach(pos => image.position = pos);

First class collections

Observable = Collection + Time

Reactive Extensions by MS

Events to Observables:
var mouseMoves = Observable.fromEvent(element, 'mousemove');

Event subscription:
//subscribe:
var handler = (e) => console.log(e);
document.addEventListener('mousemove', handler);

//unsubscribe:
document.removeEventListener('mousemove', handler);

Observable.forEach:
//subscribe:
var subscription = mouseMoves.forEach(console.log);

//unsubscrible:
subscription.dispose();

Expanded Observable.forEach:
var subscription = Observable.forEach(
	//next data
	event => console.log(event),
	//error
	error => console.error(error),
	//completed
	() => console.log('done'));

Observable literal:
{1,,2,,,,,,3}.forEach(x => console.log(x))

{1,,2,,,,,,3}.map(x => x + 1)

{1,,2,,,,,,3}.filter(x => x > 2)

{
,,,{1},
,,,,,,,,{2,,,,,,,3},
,,,,,,,,,,,,{},
,,,,,,,,,,,,,{4}
}.concatAll()

{,,,1,,,2,,,,,,,,3,,4}


mergeAll:
{
,,,{1},
,,,,,,,,{2,,,,,,,3},
,,,,,,,,,,,,{},
,,,,,,,,,,,,,{4}
}.mergeAll()

{,,,1,,,2,,,,,4,,3}

switchLatest:
{
,,,{1},
,,,,,,,,{2,,,,,,,3},
,,,,,,,,,,,,{},
,,,,,,,,,,,,,{4}
}.switchLatest()

{,,,1,,,2,,,,,4}

takeUntil:
{,,,1,,,2,,,,,3}.takeUntil(
{,,,,,,,,,4})

{,,,1,,2,,}


autocomplete:
var searchResultSets =
	keyPresses.
		throttle(250).
		map(key => 
			getJSON('/searchResults?q=' + input.value).
				retry(3).
				takeUntil(keyPresses)).
		concatAll();

searchResultsSets.forEach(
	resultSet => updateSearchResults(resultSet),
	error => showMessage('the server appears to be down'));


Promise is like hot data source, fetching data is in progress which we can't cancel.
Observable can cancel a request which is queued but not sent out yet.

var searchResultSets =
	keyPresses.
		throttle(250).
		map(key => 
			getJSON('/searchResults?q=' + input.value).
				retry(3)).
		switchLatest();



