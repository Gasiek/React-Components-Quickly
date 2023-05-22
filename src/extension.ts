import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function createReactComponent(withStyles: boolean = false, uri: vscode.Uri): void {
	const indexFileName = `index.tsx`;
	const stylesFileName = `styles.ts`;
	const componentName = vscode.window.showInputBox({
		prompt: "Enter component name"
	});
	componentName.then(name => {
		if (!name) {
			return;
		}

		const directoryPath = uri.fsPath;

		if (!directoryPath) {
			vscode.window.showErrorMessage('No workspace folder is open');
			return;
		}

		const folderName = capitalizeFirstLetter(name);
		const filePath = path.join(directoryPath, folderName);

		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);

			const config = vscode.workspace.getConfiguration('react-components-quickly');
			const indexFileContent = config.get<string>('indexFileContent') || `type Props = {};

const ${folderName} = (props: Props) => {
  return (
    <div>${folderName}</div>
  );
};

export default ${folderName};
`;
			const stylesFileContent = config.get<string>('stylesFileContent') || `import { styled } from '@Utils/theme';

`;

			fs.writeFileSync(path.join(filePath, indexFileName), indexFileContent);
			if (withStyles) {
				fs.writeFileSync(path.join(filePath, stylesFileName), stylesFileContent);
			}
			vscode.window.showInformationMessage(`Component ${folderName} created`);
		} else {
			vscode.window.showWarningMessage(`Component ${folderName} already exists`);
		}
	});
}


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand(
		"extension.createReactComponent",
		(uri: vscode.Uri) => createReactComponent(false, uri)
	),
		vscode.commands.registerCommand(
			"extension.createReactComponentWithStyles",
			(uri: vscode.Uri) => createReactComponent(true, uri))
		);
}


export function deactivate() { }
