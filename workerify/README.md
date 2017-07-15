# Workerify - Step 4

In the fourth step, we use ``Promise`` and ``async/await`` to have a fully autonomous workerify.

## Usage

Browsers usually don't allow web pages to load local content (unless you explicitely check the option), which is why you'll need a local http(s) server to serve content. The simplest way to do it is probably with Python :
- open a bash in the git directory
- Python 3 : ``python -m http.server``
- Python 2 : ``python -m SimpleHTTPServer``

Then open a local page on ``http://localhost:8000/``.

## State at step 4

We'll add a method ``call`` to our generated worker to generate a ``Promise``, and directly set the ``onmessage`` method at creation. To avoid recreating a new ``onmessage`` handler for each new promise, we store the resolve function of the promise at the worker level in a new public property.

While this is better, using workerify isn't as simple to use as the original function. Can we improve upon it ?