# workerify

There is a wealth of documentation on every ES6 feature, so young developers only need some toys projects to get hands-on experience on the rarer features. ``workerify`` is one such project, organized into steps to detail difficulties encountered for the reader. 

``workerify`` is a higher-order function transforming functions following certain constraints into another function transmitting its call to a web worker and returning a Promise of the result. To do so, ``workerify`` applies the following constraints to its function parameter :
- it only uses elements of its own scope (this is stricter than pure),
- its arity is one,
- it is synchronous.

We'll gradually try to remove the constraints as we progress.

## Usage

Checkout on each step : ``steps/#`` where `#` is the step number then look at the code and the readme, or read along.

## [Step 1](https://github.com/acouderc/toys/tree/steps/1) : Setting up an example

This commit creates our first example and displays a working web worker.

![adding 6 to 4](images/simpleworker.png)

Our index.html consists of 2 inputs and a submit button, the submit handler calls a worker created beforehand, which maps the input to numbers then adds them.

<script src="https://gist.github.com/acouderc/4abd5cb1ed1c142d1140a56a76a89fc6.js"></script>

We can see how a simple worker works, as well as a Proxy. For the Proxy case, an higher-order function would have worked just as well (or a modification of the base functions).

## [Step 2](https://github.com/acouderc/toys/tree/steps/2) : postMessagify

We're now working on transforming any simple function to one sending its result via ``postMessage``, using an higher-order function.

Since we already used a Proxy, this time we use a decorator function to return the postMessage. We created ``mockEvent`` to wrap our input into an object similar to the expected input of a worker. Finally, to test that our postMessagified function effectively sends something, we created a new worker ``workerListener`` that simply returns what it is sent.

![receiving result from workerListener](images/postmessagify.png)

 Here we see that a first problem arises : to properly send the result (message) of the postMessagified function to ``workerListener``, we need to have knowledge of that worker. We could add the targetted worker as a parameter of ``postMessagify``, but it goes against our end objective. 
 
 <script src="https://gist.github.com/acouderc/4a557fb0983ce87ae02037e768e367fe.js"></script>

 Instead, we'll use ``this.sendMessage`` and add ``workerListener`` on call. We could also bind the postMessagified function when storing it.

## [Step 3](https://github.com/acouderc/toys/tree/steps/3) : Generation of a JS file

We generate a real worker from our function using the File API.

![our generated blob](images/blobworker.png)

 We'll now use the powerful File API to automatically generate our worker. For this, we'll use ``Function.prototype.toString`` and a ``Blob``. If you're not familiar with Blobs, feel free to read [the MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Blob). You can also see a simplified example on [this commit](https://github.com/acouderc/toys/commit/c274dd9dde724329d0181d48fa19c026eafe3c97).

Using this and ``URL.createObjectURL`` - if you used ``fetch`` already, in the same manner fetched images are inserted -, we can dynamically create our worker.

<script src="https://gist.github.com/acouderc/895d9fbf2f102271566e67c23e2929b4.js"></script>

However, we have a (somewhat) big problem : toString doesn't preserve context (here, closures) ! So ``func`` doesn't refer to anything. As a naive solution, we'll hardcode a ``func`` var and it will work. However, this doesn't really solve the problem and we'll come back to it.

## [Step 4](https://github.com/acouderc/toys/tree/steps/4) : Integrating event handlers with Promises

We use ``Promise`` and ``async/await`` to have a fully autonomous workerify.

We'll add a method ``call`` to our generated worker to generate a ``Promise``, and directly set the ``onmessage`` method at creation. To avoid recreating a new ``onmessage`` handler for each new promise, we store the resolve function of the promise at the worker level in a new public property.

<script src="https://gist.github.com/acouderc/881979820d108e625a6de9a81dbf2eee.js"></script>

While this is better, using workerify isn't as simple to use as the original function. Can we improve upon it ?

## [Step 5](https://github.com/acouderc/toys/tree/steps/5) : Considerations on function, changing the return type

We test a "limit" of Proxies in the step 5, and change the return type of workerify.

<script src="https://gist.github.com/acouderc/801f818277c9fda6c577df7bca099eea.js"></script>

Since we want to be able to use our workerified function like a function, we try using Proxy to return a proxified worker, who's prototype would be a function and apply would be caught to execute the "call" ([checkout the commit](https://github.com/acouderc/toys/commit/dcf5a445c0b97fec510c09af8c79a4faa3c1992c)). However, it doesn't work :

![A function prototype Proxy can't be called](images/functionprototype.png)

Indeed, it seems what "makes" a function is its internal method ``[[Call]]`` ([see spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist)), and not the prototype. Since the method is internal, this differs from Python where we would be able to define a class with the ``__call__`` property.

<script src="https://gist.github.com/acouderc/4cb5b951f4b689547f47ebc0eee95f98.js"></script>

To solve our problem, we simply return a function instead of the worker.

## [Step 6](https://github.com/acouderc/toys/tree/steps/6) : Experiment with a Symbol

We replace the string property to a Symbol one, then go back and clean the code a bit.

<script src="https://gist.github.com/acouderc/cdad5116bafa827664b7326a29ea955d.js"></script>

The Symbols were introduced in ES6 to avoid name clashes between properties ([more details here](https://stackoverflow.com/questions/21724326/why-bring-symbols-to-javascript)). Since we (somewhat artificially) added the ``promiseResolver`` property to our worker object, it gives us a good opportunity to try them. You can see the resulting code [here](https://github.com/acouderc/toys/commit/77ee25dadcce5dc094e7730853931fdba3de673d).

However, as it isn't really justified to use ``promiseResolver`` as an object property instead of a variable, we remove that part altogether.

## [Step 7](https://github.com/acouderc/toys/tree/steps/7) : Turning workerify to an ES6 module

workerify is exported as a module, and we use webpack for compatibility.

Finally, our naive implementation is done, so we'll isolate it in a separate file as a module ([see MDN doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)).

<script src="https://gist.github.com/acouderc/d020027fb6f85e8f31d7f2d3125c3404.js"></script>

This functionality is currently behind a flag on Chrome so we use the Webpack bundler to make it work and slightly modify the project structure.
