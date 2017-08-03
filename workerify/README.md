# Workerify - Step 7

workerify is exported as a module, and we use webpack for compatibility.

## Usage

From now on we'll also use Webpack, so you'll need node and npm, and to use :
- ``npm install``
- ``npm run build``

You'll also need a local http(s) server to serve content. The simplest way to do it is probably with Python :
- open a bash in the git directory
- Python 3 : ``python -m http.server``
- Python 2 : ``python -m SimpleHTTPServer``

Then open a local page on ``http://localhost:8000/dist/``.

## State at step 7

Finally, our naive implementation is done, so we'll isolate it in a separate file as a module ([see MDN doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)).

This functionality is currently behind a flag on Chrome so we'll use the Webpack bundler to make it work and slightly modify the project structure.