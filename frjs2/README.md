# Functional Reactive JavaScript:


#### Exercise 27: Stock Ticker

```javascript
function(pricesNASDAQ, printRecord) {
	var microsoftPrices,
		now = new Date(),
		tenDaysAgo = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 10);

	// use filter() to filter the trades for MSFT prices recorded any time after 10 days ago
	microsoftPrices =
		pricesNASDAQ.
			filter(function(priceRecord) {
			  return priceRecord.name === 'MSFT' && priceRecord.timeStamp > tenDaysAgo;
			});

	// Print the trades to the output console
	microsoftPrices.
		forEach(function(priceRecord) {
			printRecord(priceRecord);
		});
}
```

#### Exercise 28: Subscribing to an event

```javascript
function(button) {
	// the button click handler
	var handler = function(ev) {
		// Unsubscribe from the button event.
		button.removeEventListener("click", handler);

		alert("Button was clicked. Unsubscribing from event.");
	};

	// add the button click handler
	button.addEventListener("click", handler);
}
```

#### Exercise 29: Traversing an Event

```javascript
function(button) {
	var buttonClicks = Observable.fromEvent(button, "click");

	// In the case of an Observable, forEach returns a subscription object.
	var subscription =
		buttonClicks.
			forEach(function(priceRecord) {
				alert("Button was clicked. Stopping Traversal.");

				// Stop traversing the button clicks
				subscription.dispose();
			});
}
```

#### Exercise 30: Completing Sequences with take()

```javascript
function(button) {
	var buttonClicks = Observable.fromEvent(button, "click");

	// Use take() to listen for only one button click
	// and unsubscribe.
	buttonClicks.
		take(1).
		forEach(function(priceRecord) {
			alert("Button was clicked once. Stopping Traversal.");
		});
}
```

#### Exercise 31: Completing sequences with takeUntil()

```javascript
function(pricesNASDAQ, printRecord, stopButton) {
	var stopButtonClicks = Observable.fromEvent(stopButton,"click"),
		microsoftPrices =
			pricesNASDAQ.
				filter(function(priceRecord) {
					return priceRecord.name === "MSFT";
				}).
				takeUntil(stopButtonClicks);

	microsoftPrices.
		forEach(function(priceRecord) {
			printRecord(priceRecord);
		});
}
```

#### Exercise 32: Creating a mouse drag event

```javascript
function(sprite, spriteContainer) {
	var spriteMouseDowns = Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContainerMouseUps = Observable.fromEvent(spriteContainer, "mouseup"),
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			spriteMouseDowns.
				concatMap(function(contactPoint) {
					// ...retrieve all the mouse move events on the sprite container...
					return spriteContainerMouseMoves.
						// ...until a mouse up event occurs.
						takeUntil(spriteContainerMouseUps);
				});

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
	});
}
```

#### Exercise 33: Improving our mouse drag event

```javascript
function(sprite, spriteContainer) {
	// All of the mouse event sequences look like this:
	// seq([ {pageX: 22, pageY: 3423, offsetX: 14, offsetY: 22} ,,, ])
	var spriteMouseDowns = Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContainerMouseUps = Observable.fromEvent(spriteContainer, "mouseup"),
		// Create a sequence that looks like this:
		// seq([ {pageX: 22, pageY:4080 },,,{pageX: 24, pageY: 4082},,, ])
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			spriteMouseDowns.
				concatMap(function(contactPoint) {
					// ...retrieve all the mouse move events on the sprite container...
					return spriteContainerMouseMoves.
						// ...until a mouse up event occurs.
						takeUntil(spriteContainerMouseUps).
						map(function(movePoint) {
							return {
								pageX: movePoint.pageX - contactPoint.offsetX,
								pageY: movePoint.pageY - contactPoint.offsetY
							};
						});
				});

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
	});
}
```

#### Exercise 34: HTTP requests

```javascript
function($) {
	$.getJSON(
		"http://api-global.netflix.com/queue",
		{
			success: function(json) {
				alert("Data has arrived.");
			},
			error: function(ex) {
				alert("There was an error.")
			}
		});
}
```

#### Exercise 35: Sequencing HTTP requests with callbacks

```javascript
function(window, $, showMovieLists, showError) {
	var error,
		configDone,
		movieLists,
		queueList,
		windowLoaded,
		outputDisplayed,
		errorHandler = function() {
			// Otherwise show the error.
			error = "There was a connectivity error";

			// We may be ready to display out
			tryToDisplayOutput();
		},
		tryToDisplayOutput = function() {
			if (outputDisplayed) {
				return;
			}
			if (windowLoaded) {
				if (configDone && movieLists !== undefined) {
					if (queueList !== undefined) {
						movieLists.push(queueList);
					}
					outputDisplayed = true;
					showMovieLists(JSON.stringify(movieLists));
				}
				else if (error) {
					outputDisplayed = true;
					showError(error);
				}
			}
		},
		windowLoadHandler = function() {
			windowLoaded = true;

			// Remember to unsubscribe from events
			window.removeEventListener("load", windowLoadHandler);

			// This may be the last task we're waiting on, so try and display output.
			tryToDisplayOutput();
		};

	// Register for the load event
	window.addEventListener("load", windowLoadHandler);

	// Request the service url prefix for the users AB test
	$.getJSON(
		"http://api-global.netflix.com/abTestInformation",
		{
			success: function(abTestInformation) {
				// Request the member's config information to determine whether their instant
				// queue should be displayed.
				$.getJSON(
					"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config",
					{
						success: function(config) {
							// Parallel retrieval of movie list could've failed,
							// in which case we don't want to issue this call.
							if (!error) {
								// If we're supposed to
								if (config.showInstantQueue) {
									$.getJSON(
										"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue",
										{
											success: function(queueMessage) {
												queueList = queueMessage.list;

												configDone = true;
												tryToDisplayOutput();
											},
											error: errorHandler
										});
								}
								else {
									configDone = true;
									tryToDisplayOutput();
								}
							}
						},
						error: errorHandler
					});

				// Retrieve the movie list
				$.getJSON(
					"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists",
					{
						success: function(movieListMessage) {
							movieLists = movieListMessage.list;
							tryToDisplayOutput();
						},
						error: errorHandler
					});
			},
			error: errorHandler
		});
}
```

#### Exercise 36: Traversing callback-based Asynchronous APIs

```javascript
function(window, $) {
	var getJSON = function(url) {
		return Observable.create(function(observer) {
			var subscribed = true;

			$.getJSON(url,
				{
					success:
						function(data) {
							// If client is still interested in the results, send them.
							if (subscribed) {
								// Send data to the client
								observer.onNext(data);
								// Immediately complete the sequence
								observer.onCompleted();
							}
						},
					error: function(ex) {
						// If client is still interested in the results, send them.
						if (subscribed) {
							// Inform the client that an error occurred.
							observer.onError(ex);
						}
					}
				});

			// Definition of the Subscription objects dispose() method.
			return function() {
				subscribed = false;
			}
		});
	};

	var subscription =
		getJSON("http://api-global.netflix.com/abTestInformation").
			forEach(
				// observer.onNext()
				function(data) {
					alert(JSON.stringify(data));
				},
				// observer.onError()
				function(err) {
					alert(err)
				},
				// observer.onCompleted()
				function() {
					alert("The asynchronous operation has completed.")
				});
}
```

#### Exercise 37: Sequencing HTTP requests with Observable

```javascript
function(window, getJSON, showMovieLists, showError) {
	var movieListsSequence =
		Observable.zip(
			getJSON("http://api-global.netflix.com/abTestInformation").
				concatMap(function(abTestInformation) {
					return Observable.zip(
						getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config").
							concatMap(function(config) {
								if (config.showInstantQueue) {
									return getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue").
										map(function(queueMessage) {
											return queueMessage.list;
										});
								}
								else {
									return Observable.returnValue('');
								}
							}),
						getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists"),
						function(queue, movieListsMessage) {
							var copyOfMovieLists = Object.create(movieListsMessage.list);
							if (queue !== undefined) {
								copyOfMovieLists.push(queue);
							}

							return copyOfMovieLists;
						});
				}),
			Observable.fromEvent(window, "click"),
			function(movieLists, loadEvent) {
				return movieLists;
			});

	movieListsSequence.
		forEach(
			function(movieLists) {
				showMovieLists(movieLists);
			},
			function(err) {
				showError(err);
			});
}
```

#### Exercise 38: Throttle Input

```javascript
function (clicks, saveData, name) {
	return clicks.
		throttle(1000).
		concatMap(function () {
			return saveData(name);
		})
}
```

#### Exercise 39: Autocomplete Box

```javascript
function (getSearchResultSet, keyPresses, textBox) {

	var getSearchResultSets =
		keyPresses.
			map(function () {
				return textBox.value;
			}).
			throttle(1000).
			concatMap(function (text) {
				return getSearchResultSet(text).takeUntil(keyPresses);
			});

	return getSearchResultSets;
}
```

#### Exercise 40: Distinct Until Changed Input

```javascript
function (keyPresses, isAlpha) {

	return keyPresses.
		map(function (e) { return String.fromCharCode(e.keyCode); }).
		filter(function (character) { return isAlpha(character); }).
		distinctUntilChanged().
		scan('', function (stringSoFar, character) {
			return stringSoFar + character;
		});
}
```

Credits to Jafar Husain, http://jhusain.github.io/learnrx/
