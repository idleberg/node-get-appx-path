# get-appx-path

[![npm](https://flat.badgen.net/npm/license/get-appx-path)](https://www.npmjs.org/package/get-appx-path)
[![npm](https://flat.badgen.net/npm/v/get-appx-path)](https://www.npmjs.org/package/get-appx-path)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-get-appx-path)](https://circleci.com/gh/idleberg/node-get-appx-path)

Returns the path of a Windows Store application (Appx)

## Prerequisites

This library requires PowerShell 5.0 (or higher) and support for the Windows Store

## Installation

`yarn add get-appx-path || npm install get-appx-path`

## Usage

`getAppxPath(appID: string, options: Object)`

Example usage in script:

```js
const getAppxPath = require('get-appx-path');

// Application ID
const appID = 'SpotifyAB.SpotifyMusic';

(async () => {
    try {
        const appx = await getAppxPath(appID);
        console.log(appx.path);
    } catch (err) {
        console.error(err);
    }
})();
```

### Options

#### options.inputEncoding

Default: `utf8`

#### options.outputEncoding

Default: `utf8`

#### options.debugMsg

Default: `false`

#### options.verbose

Default: `true`

#### options.executionPolicy

Default: `Bypass`

#### options.noProfile

Default: `true`

## Related

- [exec-appx](https://www.npmjs.com/package/exec-appx)
- [get-appx-manifest](https://www.npmjs.com/package/get-appx-manifest)

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)
