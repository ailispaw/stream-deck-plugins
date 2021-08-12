# Stream Deck Plugins

This is a repository to make my Stream Deck plugins.

## My Plugins

- [zone.paw.stream-deck.mmhmm.sdPlugin](./zone.paw.stream-deck.mmhmm.sdPlugin/) for mmhmm.app

## Building

```
$ git clone https://github.com/ailispaw/stream-deck-plugins.git
$ cd stream-deck-plugins
$ make
```

- https://developer.elgato.com/documentation/stream-deck/sdk/exporting-your-plugin/

## Debuggging

- https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/#debugging-your-javascript-plugin
```
$ defaults write com.elgato.StreamDeck html_remote_debugging_enabled -bool YES
$ open http://localhost:23654/
```

- https://nodejs.org/en/docs/guides/debugging-getting-started/#enabling-remote-debugging-scenarios
```
$ open brave://inspect/#devices
```

## Directories

- ~/Library/Logs/StreamDeck
- ~/Library/Application Support/com.elgato.StreamDeck/Plugins

## References

- https://developer.elgato.com/documentation/
