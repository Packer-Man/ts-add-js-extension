import type { PartialConfig } from './cli-command-parser';
import type { ParsedConfig } from './config';

import ParseArgs from './cli-command-parser';
import { parseConfig, valuelizeConfig } from './config';
import { writeMany, findMany } from './read-write';

const tsAddJsExtension = async ({
	config,
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	parsedConfigFunction,
}: Readonly<{
	config: PartialConfig;
	/**
	 * @deprecated since version 1.4.0
	 * Will be deleted in version 2.0
	 * To pass configurations to `tsAddJsExtension`
	 * Just pass the configurations directly
	 * ```
	 * tsAddJsExtension({
	 *  config:{
	 *   dir:'dist'
	 *  }
	 * })
	 * ```
	 * Instead of passing with this function
	 * ```
	 * tsAddJsExtension({
	 *  parsedConfigFunction: () => parseConfig(argv)
	 * })
	 * ```
	 * As it will be ignroed
	 */
	parsedConfigFunction?: () => ParsedConfig;
}>) => {
	if (parsedConfigFunction) {
		throw new Error(
			[
				`Please do not use parsedConfigFunction as it's deprecated and contains complicated parsing`,
				`Instead, just pass configurations directly`,
			].join('\n')
		);
	}

	const trueConfig = valuelizeConfig(config);

	return writeMany({
		showChanges: trueConfig.showChanges,
		foundMany: await findMany(trueConfig),
	});
};

const main = (args: string) => {
	const parser = ParseArgs.create(args);
	const help = parser.asHelp();

	if (help.exists) {
		return console.log(help.value);
	}

	const version = parser.asVersion();

	if (version.exists) {
		return console.log(version.value);
	}

	return tsAddJsExtension({
		config: parser.asOperation(),
	})
		.then((result) => {
			switch (result.type) {
				case 'error': {
					console.error(result.error);
				}
			}
		})
		.catch((error: unknown) => {
			console.error(error);
		});
};

export { parseConfig, tsAddJsExtension };
export default main;
