# get-appx-path

[![npm](https://flat.badgen.net/npm/license/get-appx-path)](https://www.npmjs.org/package/get-appx-path)
[![npm](https://flat.badgen.net/npm/v/get-appx-path)](https://www.npmjs.org/package/get-appx-path)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-get-appx-path)](https://circleci.com/gh/idleberg/node-get-appx-path)
[![David](https://flat.badgen.net/david/dev/idleberg/node-get-appx-path)](https://david-dm.org/idleberg/node-get-appx-path?type=dev)

Returns the path of a Windows Store app (Appx)

## Prerequisites

This library requires PowerShell and a Windows version with support for Windows Store apps

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
        let appxPath = await getAppxPath(appID);
        console.log(appxPath);
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

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-get-appx-path) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
