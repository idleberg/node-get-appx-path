'use strict';

const powershell = require('node-powershell');
const { platform } = require('os');

module.exports = (appID, options) => {
    if (platform() !== 'win32') {
        throw 'Error: Not a Windows operating system';
    }

    options = Object.assign({
        debugMsg: false,
        executionPolicy: 'Bypass',
        noProfile: true
    }, options);

    let ps = new powershell(options);

    ps.addCommand(`$AppxPackage = (Get-AppxPackage -Name "${appID}")`);
    ps.addCommand('$Executable = ($AppxPackage | Get-AppxPackageManifest).Package.Applications.Application.Executable');
    ps.addCommand('Write-Host "$($AppxPackage.InstallLocation)|$($Executable)" | ConvertFrom-String -Delimiter "|"');
    // ps.addCommand('Write-Host \'{path: "$($AppxPackage.InstallLocation)", file: "$($Executable)"}\'');

    return ps.invoke()
        .then( appxPath => {
            if (!appxPath) {
                throw 'Error: ENOENT, no such file or directory';
            }

            return appxPath;
        })
        .finally( () => ps.dispose());
};
