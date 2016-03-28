Town Crier
======
Add multiple RSS feeds or choose from the default ones and get news directly to your command line.

This application is still in early stages, so it might be rewritten. It is ment for learning purpose only. I've used different approaches to solve problems just for the fun of it.

Installation
------
```bash
$ npm install -g town-crier
```

Usage
------
![town-crier](http://i.imgur.com/4G0V429.gif)

```bash
$ town-crier
```

```
Usage
    $ town-crier <input>

Options
    --help           Help
    --interval       Interval in seconds
    --dateFormat     How you'd like your date format
    --sources        Comma separated list of rss sources you want to append current list
    --reset          Reset the config file

 Examples
    $ town-crier --interval=60
    $ town-crier --dateFormat=mm-dd-yyyy
    $ town-crier --sources=http://www.vg.no/rss/feed/,http://www.aftenposten.no/rss/
    $ town-crier --reset
```

Tests (none)
------
```bash
$ npm test
```

Contribution
------
Contributions are appreciated.

License
------
MIT-licensed. See LICENSE.
