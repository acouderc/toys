# Workerify - Step 5

We test a limit of Proxies in the step 5, and change the return type of workerify.

## Usage

Browsers usually don't allow web pages to load local content (unless you explicitely check the option), which is why you'll need a local http(s) server to serve content. The simplest way to do it is probably with Python :
- open a bash in the git directory
- Python 3 : ``python -m http.server``
- Python 2 : ``python -m SimpleHTTPServer``

Then open a local page on ``http://localhost:8000/``.

## State at step 5

Since we want to be able to use our workerified function like a function, we tried using Proxy to return a proxified worker, who's prototype would be a function and apply would be caught to execute the "call". However, it doesn't work :

![A function prototype Proxy can't be called](images/functionprototype.png)

Indeed, it seems what "makes" a function is it's internal method ``[[Call]]`` ([see spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist)), and not the prototype. Since the method is internal, this differs from Python where we would be able to define a class with the ``__call__`` property.

To solve our problem, we'll simply return a function instead of the worker.