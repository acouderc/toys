# Workerify - Step 2

We're now working on transforming any simple function to one sending its result via ``postMessage``, using an higher-order function.

## Usage

Browsers usually don't allow web pages to load local content (unless you explicitely check the option), which is why you'll need a local http(s) server to serve content. The simplest way to do it is probably with Python :
- open a bash in the git directory
- Python 3 : ``python -m http.server``
- Python 2 : ``python -m SimpleHTTPServer``

Then open a local page on ``http://localhost:8000/``.

## State at step 2

![receiving result from workerListener](images/postmessagify.png)

 Since we already used a Proxy, this time we use a decorator function to return the postMessage. We created ``mockEvent`` to wrap our input into an object similar to the expected input of a worker. Finally, to test that our postMessagified function effectively sends something, we created a new worker ``workerListener`` that simply returns what it is sent.

 Here we see that a first problem arises : to properly send the result (message) of the postMessagified function to ``workerListener``, we need to have a knowledge of that worker. We could add the targetted worker as a parameter of ``postMessagify``, but it goes against our end objective. Instead, we'll use ``this.sendMessage`` and add ``workerListener`` on call. We could also bind the postMessagified function when storing it.