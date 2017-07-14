# Workerify - Step 1

This commit is the first step towards our project, deliberately trivial.

## Usage

Browsers usually don't allow web pages to load local content (unless you explicitely check the option), which is why you'll need a local http(s) server to serve content. The simplest way to do it is probably with Python :
- open a bash in the git directory
- Python 3 : ``python -m http.server``
- Python 2 : ``python -m SimpleHTTPServer``

Then open a local page on ``http://localhost:8000/``.

## State at step 1

![adding 6 to 4](images/simpleworker.png)

Our index.html consists of 2 inputs and a submit button, the submit handler calls a worker created beforehand, which maps the input to numbers then adds them.

We can see how a simple worker works, as well as a Proxy. For the Proxy case, an higher-order function would have worked just as well (or a modification of the base functions).