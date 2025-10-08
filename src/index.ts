import { platform } from 'node:os';
import Powershell from 'node-powershell';

export async function getAppxPath(appID: string, userOptions?: Powershell.ShellOptions) {
	if (platform() !== 'win32') {
		throw 'Error: This library requires PowerShell 5.0 (or higher) and support for the Windows Store';
	}

	const options: Powershell.ShellOptions = {
		debugMsg: false,
		executionPolicy: 'Bypass',
		noProfile: true,
		...userOptions,
	};

	const ps = new Powershell(options);

	const commands = [
		`$AppxPackage = (Get-AppxPackage -Name "${appID}")`,
		'$dirname = $AppxPackage.InstallLocation',
		'$filename = ($AppxPackage | Get-AppxPackageManifest).Package.Applications.Application.Executable',
		'$path = (Join-Path -Path $dirname -ChildPath $filename)',
		'"$($dirname) : $($filename) : $path" | ConvertFrom-String -Delimiter " : " -PropertyNames dirname, filename, path | ConvertTo-Json',
	];

	for (const command of commands) {
		ps.addCommand(command);
	}

	try {
		const appxObject: string = await ps.invoke();

		return JSON.parse(appxObject);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.includes("Cannot bind argument to parameter 'Path' because it is null")
		) {
			throw new Error('ENOENT, no such file or directory');
		}

		// All other errors
		throw error;
	} finally {
		ps.dispose();
	}
}
