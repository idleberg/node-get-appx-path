import { platform } from 'node:os';
import Powershell from 'node-powershell';

type AppxPathObject = {
	dirname: string;
	filenames: string[];
	paths: string[];
};

/**
 * Get an object containing the installation path and executable filenames of a given Appx package.
 * @param appID the id of the Appx package, e.g.`"Mozilla.Firefox"`
 * @param userOptions options passed to node-powershell
 * @returns an object of paths and filenames
 */
async function getAppxPath(appID: string, userOptions?: Powershell.ShellOptions): Promise<AppxPathObject> {
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
		'$filenames = @(($AppxPackage | Get-AppxPackageManifest).Package.Applications.Application.Executable)',
		'$paths = @($filenames | ForEach-Object { Join-Path -Path $dirname -ChildPath $_ })',
		'@{ dirname = $dirname; filenames = $filenames; paths = $paths } | ConvertTo-Json',
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
