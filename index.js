'use strict';

const powershell = require('node-powershell');
const { platform } = require('os');

module.exports = (appID, options) => {
    if (platform() !== 'win32') {
        throw 'Error: This library requires PowerShell 5.0 (or higher) and for support the Windows Store';
    }

    options = Object.assign({
        debugMsg: false,
        executionPolicy: 'Bypass',
        noProfile: true
    }, options);

    let ps = new powershell(options);

    ps.addCommand(`$AppxPackage = (Get-AppxPackage -Name "${appID}")`);
    ps.addCommand('$dirname = $AppxPackage.InstallLocation');
    ps.addCommand('$filename = ($AppxPackage | Get-AppxPackageManifest).Package.Applications.Application.Executable');
    ps.addCommand('$path = (Join-Path -Path $dirname -ChildPath $filename)');
    ps.addCommand('"$($dirname) : $($filename) : $path" | ConvertFrom-String -Delimiter " : " -PropertyNames dirname, filename, path | ConvertTo-Json');

    return ps.invoke()
        .then( appxObject => JSON.parse(appxObject))
        .catch( (err) => {
            if (err.includes('Cannot bind argument to parameter \'Path\' because it is null')) {
                throw 'Error: ENOENT, no such file or directory';
            }

            // What else could go wrong?
            throw err;
        })
        .finally( () => ps.dispose());
};
