import { platform } from 'node:os';
import Powershell from 'node-powershell';

async function getAppxPath(appID: string, userOptions?: Powershell.ShellOptions) {
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
		const appxString: string = await ps.invoke();

		return JSON.parse(appxString);
	} catch (error) {
		handleErrors(error);
	} finally {
		ps.dispose();
	}
}

const errorMappings = [
	{
		match: "Cannot bind argument to parameter 'Path' because it is null",
		message: 'ENOENT, no such file or directory',
	},
	{
		match: "Join-Path : Cannot convert 'System.Object[]' to the type 'System.String' required by parameter 'ChildPath'",
		message: 'The application consists of multiple executables',
	},
];

function handleErrors(error: unknown): never {
	if (!(error instanceof Error)) {
		throw error;
	}

	const mapping = errorMappings.find((m) => error.message.includes(m.match));

	if (mapping) {
		throw new Error(mapping.message);
	}

	throw error;
}

export { getAppxPath };

// Backwards compatibility, but deprecated
export default getAppxPath;
