import Powershell from 'node-powershell';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAppxPath } from './index.ts';

vi.mock('node:os', () => ({
	platform: vi.fn(() => 'win32'),
}));

vi.mock('node-powershell');

describe('getAppxPath', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return parsed appx path object on success', async () => {
		const mockResult = {
			dirname: ['C:\\Program Files\\WindowsApps\\App'],
			filenames: ['app.exe'],
			paths: ['C:\\Program Files\\WindowsApps\\App\\app.exe'],
		};

		const mockInvoke = vi.fn().mockResolvedValue(JSON.stringify(mockResult));
		const mockDispose = vi.fn();
		const mockAddCommand = vi.fn();

		vi.mocked(Powershell).mockImplementation(
			() =>
				({
					invoke: mockInvoke,
					dispose: mockDispose,
					addCommand: mockAddCommand,
					// biome-ignore lint/suspicious/noExplicitAny: let's be lax about rules
				}) as any,
		);

		const result = await getAppxPath('TestApp', {});

		expect(result).toEqual(mockResult);
		expect(mockAddCommand).toHaveBeenCalledTimes(5);
		expect(mockAddCommand).toHaveBeenNthCalledWith(
			4,
			'$paths = @($filenames | ForEach-Object { Join-Path -Path $dirname -ChildPath $_ })',
		);
		expect(mockInvoke).toHaveBeenCalledOnce();
		expect(mockDispose).toHaveBeenCalledOnce();
	});

	it('should throw ENOENT error when path parameter is null', async () => {
		const mockInvoke = vi
			.fn()
			.mockRejectedValue(new Error("Cannot bind argument to parameter 'Path' because it is null"));
		const mockDispose = vi.fn();
		const mockAddCommand = vi.fn();

		vi.mocked(Powershell).mockImplementation(
			() =>
				({
					invoke: mockInvoke,
					dispose: mockDispose,
					addCommand: mockAddCommand,
					// biome-ignore lint/suspicious/noExplicitAny: let's be lax about rules
				}) as any,
		);

		await expect(getAppxPath('NonExistentApp', {})).rejects.toThrow('ENOENT, no such file or directory');
		expect(mockDispose).toHaveBeenCalledOnce();
	});

	it('should handle multiple executables', async () => {
		const mockResult = {
			dirname: ['C:\\Program Files\\WindowsApps\\App'],
			filenames: ['app.exe', 'helper.exe', 'background.exe'],
			paths: [
				'C:\\Program Files\\WindowsApps\\App\\app.exe',
				'C:\\Program Files\\WindowsApps\\App\\helper.exe',
				'C:\\Program Files\\WindowsApps\\App\\background.exe',
			],
		};

		const mockInvoke = vi.fn().mockResolvedValue(JSON.stringify(mockResult));
		const mockDispose = vi.fn();
		const mockAddCommand = vi.fn();

		vi.mocked(Powershell).mockImplementation(
			() =>
				({
					invoke: mockInvoke,
					dispose: mockDispose,
					addCommand: mockAddCommand,
					// biome-ignore lint/suspicious/noExplicitAny: let's be lax about rules
				}) as any,
		);

		const result = await getAppxPath('MultiExecutableApp', {});

		expect(result).toEqual(mockResult);
		expect(mockDispose).toHaveBeenCalledOnce();
	});

	it('should rethrow other errors', async () => {
		const mockError = new Error('Some other PowerShell error');
		const mockInvoke = vi.fn().mockRejectedValue(mockError);
		const mockDispose = vi.fn();
		const mockAddCommand = vi.fn();

		vi.mocked(Powershell).mockImplementation(
			() =>
				({
					invoke: mockInvoke,
					dispose: mockDispose,
					addCommand: mockAddCommand,
					// biome-ignore lint/suspicious/noExplicitAny: let's be lax about rules
				}) as any,
		);

		await expect(getAppxPath('TestApp', {})).rejects.toThrow('Some other PowerShell error');
		expect(mockDispose).toHaveBeenCalledOnce();
	});

	it('should dispose powershell instance even on success', async () => {
		const mockResult = { dirname: ['test'], filenames: ['test.exe'], paths: ['test/test.exe'] };
		const mockInvoke = vi.fn().mockResolvedValue(JSON.stringify(mockResult));
		const mockDispose = vi.fn();
		const mockAddCommand = vi.fn();

		vi.mocked(Powershell).mockImplementation(
			() =>
				({
					invoke: mockInvoke,
					dispose: mockDispose,
					addCommand: mockAddCommand,
					// biome-ignore lint/suspicious/noExplicitAny: let's be lax about rules
				}) as any,
		);

		await getAppxPath('TestApp', {});

		expect(mockDispose).toHaveBeenCalledOnce();
	});

	it('should pass user options to Powershell', async () => {
		const mockResult = { dirname: ['test'], filenames: ['test.exe'], paths: ['test/test.exe'] };
		const mockInvoke = vi.fn().mockResolvedValue(JSON.stringify(mockResult));
		const mockDispose = vi.fn();
		const mockAddCommand = vi.fn();
		const userOptions = { debugMsg: true, executionPolicy: 'RemoteSigned' as const };

		let capturedOptions: Powershell.ShellOptions | undefined;
		vi.mocked(Powershell).mockImplementation((options) => {
			capturedOptions = options;
			return {
				invoke: mockInvoke,
				dispose: mockDispose,
				addCommand: mockAddCommand,
				// biome-ignore lint/suspicious/noExplicitAny: let's be lax about rules
			} as any;
		});

		// @ts-expect-error
		await getAppxPath('TestApp', userOptions);

		expect(capturedOptions).toMatchObject(userOptions);
	});
});
