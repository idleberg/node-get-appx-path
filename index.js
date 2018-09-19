'use strict';

const powershell = require('node-powershell');
const { join } = require('path');
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

    ps.addCommand(`(Get-AppxPackage -Name "${appID}").InstallLocation`);

    return ps.invoke()
        .then( output => {
            if (!output) {
                throw 'Error: ENOENT, no such file or directory';
            }
            const appxPath = join(process.env.ProgramFiles, 'WindowsApps', output.trim());

            return appxPath;
        })
        .finally( () => ps.dispose());
};
