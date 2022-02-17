import * as vscode from 'vscode';
import { setupCommand } from './services/commands';
import { toggleEnablePlugin } from './services/helper';

export async function activate(context: vscode.ExtensionContext) {
  setupCommand(context);
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('italicc.plugin.enabled')) {
      toggleEnablePlugin(context, vscode.workspace.getConfiguration().get('italicc.plugin.enabled'));
    }
  });
}

export function deactivate() {}
