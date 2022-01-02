import * as vscode from 'vscode';
import { textMateRules } from './textmate-scopes';

export async function activate(context: vscode.ExtensionContext) {
	if (vscode.workspace.getConfiguration().get('italicc.enabled')) {
		toggleItalic(context, vscode.workspace.getConfiguration().get('italicc.enabled'));
	}
	vscode.workspace.onDidChangeConfiguration(e => {
		if (!e.affectsConfiguration('italicc.enabled')) {
			return false;
		}
		toggleItalic(context, vscode.workspace.getConfiguration().get('italicc.enabled'));
	});
}

export function deactivate() {}

async function toggleItalic(context: vscode.ExtensionContext, enabled: boolean|undefined): Promise<void> {
	if (enabled) {
		const oldConfig = vscode.workspace.getConfiguration().get('editor.tokenColorCustomizations') as any;
		let config = {...oldConfig, ...textMateRules};
		if (oldConfig['textMateRules'] !== undefined) {
			let mergedConfig = oldConfig['textMateRules'] as Array<any>;
			mergedConfig.push(textMateRules.textMateRules[0]);
			config = { ...oldConfig, 
				textMateRules: mergedConfig
			};
		}
		const savePath = vscode.Uri.file(context.globalStorageUri.fsPath + '/backup.json');
		const configBuffer = Buffer.from(JSON.stringify(oldConfig, null, 2), 'utf8');
		await vscode.workspace.fs.writeFile(savePath, configBuffer);
		vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', config, vscode.ConfigurationTarget.Global);
		vscode.window.setStatusBarMessage('[italicc] All italic will disappear ✅');
	} else {
		const path = context.globalStorageUri.fsPath + '/backup.json';
		let readStr = undefined;
		try {
			const configBuffer = await vscode.workspace.fs.readFile(vscode.Uri.file(path));
			readStr = Buffer.from(configBuffer).toString('utf8');
		} catch(e) {
			console.log(e);
		}
		if (readStr) {
			vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', JSON.parse(readStr), true);
			await vscode.workspace.fs.delete(vscode.Uri.file(path));
		} else {
			vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', {}, true);
		}
		vscode.window.setStatusBarMessage('[italicc] All italic will appear again ⛔');
	}
}
