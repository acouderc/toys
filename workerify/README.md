# Workerify - Step 6

We replace the string property to a Symbol one, then clean the code a bit.

## Usage

Browsers usually don't allow web pages to load local content (unless you explicitely check the option), which is why you'll need a local http(s) server to serve content. The simplest way to do it is probably with Python :
- open a bash in the git directory
- Python 3 : ``python -m http.server``
- Python 2 : ``python -m SimpleHTTPServer``

Then open a local page on ``http://localhost:8000/``.

## State at step 6

The Symbols were introduced in ES6 to avoid name clashes between properties ([more details here](https://stackoverflow.com/questions/21724326/why-bring-symbols-to-javascript)). Since we (somewhat artificially) added the ``promiseResolver`` property to our worker object, it gives us a good opportunity to try them. You can see the resulting code [here]().

However, as it isn't really justified to use ``promiseResolver`` as an object property instead of a variable, we'll remove that part afterwards.