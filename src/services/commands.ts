import * as vscode from 'vscode';

export function setupCommand(context: vscode.ExtensionContext): void {
  const enabled = vscode.commands.registerCommand('italicc.command.enabled', () => {
    const enabled = vscode.workspace.getConfiguration().get('italicc.plugin.enabled');
    vscode.workspace.getConfiguration().update('italicc.plugin.enabled', !enabled, vscode.ConfigurationTarget.Global);
    sendMessage(`Italicc extensions ${enabled ? 'disabled 🙋‍♂️' : 'enabled 🚀'}!`);
  });
  context.subscriptions.push(enabled);
}

function sendMessage(message: any): void {
  vscode.window.showInformationMessage(message);
}
