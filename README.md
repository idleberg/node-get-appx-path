# get-appx-path

[![License](https://img.shields.io/github/license/idleberg/node-get-appx-path?color=blue&style=for-the-badge)](https://github.com/idleberg/node-get-appx-path/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/get-appx-path?style=for-the-badge)](https://www.npmjs.org/package/get-appx-path)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/node-get-appx-path/main?style=for-the-badge)

Returns the path of a Windows Store application (Appx).

## Prerequisites

This library requires PowerShell 5.0 (or higher) and support for the Windows Store.

## Installation

```sh
npm install get-appx-path
```

## Usage

`getAppxPath(appID, options)`

Example usage in script:

```js
import { getAppxPath } from 'get-appx-path';

const appx = await getAppxPath('Mozilla.Firefox');
console.log(appx.path);
```

### Options

#### `options.inputEncoding`

Default: `"utf8"`

#### `options.outputEncoding`

Default: `"utf8"`

#### `options.debugMsg`

Default: `false`

#### `options.verbose`

Default: `true`

#### `options.executionPolicy`

Default: `"Bypass"`

#### `options.noProfile`

Default: `true`

## Related

- [exec-appx](https://www.npmjs.com/package/exec-appx)
- [get-appx-manifest](https://www.npmjs.com/package/get-appx-manifest)

## License

This work is licensed under [The MIT License](LICENSE).
