import * as vscode from 'vscode';
import { textMateRules } from '../config.stub';
import { TokenColorCustomizationType } from '../types/setting.types';

/**
 * Get current tokenColorCustomization settings
 * @returns {TokenColorCustomizationType}
 */
export function getTokenColorCustomizationsSetting(): TokenColorCustomizationType {
  return vscode.workspace.getConfiguration().get('editor.tokenColorCustomizations') as TokenColorCustomizationType;
}
/**
 * Backup current tokenColorCustomization settings to file
 * @param context {vscode.ExtensionContext}
 * @param config {TokenColorCustomizationType}
 */
export function backupOriginalSetting(context: vscode.ExtensionContext, config: TokenColorCustomizationType): void {
  const savePath = vscode.Uri.file(context.globalStorageUri.fsPath + '/backup.json');
  const configBuffer = Buffer.from(JSON.stringify(config, null, 2), 'utf8');
  vscode.workspace.fs.writeFile(savePath, configBuffer);
}

/**
 * Toggle italic text on/off
 * @param context
 * @param disabled
 */
export async function toggleEnablePlugin(context: vscode.ExtensionContext, enabled: boolean | undefined): Promise<void> {
  if (enabled) {
    const originalSetting = getTokenColorCustomizationsSetting();
    backupOriginalSetting(context, originalSetting);
    vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', textMateRules, vscode.ConfigurationTarget.Global);
  } else {
    const path = context.globalStorageUri.fsPath + '/backup.json';
    try {
      vscode.workspace.fs.readFile(vscode.Uri.file(path)).then((value) => {
        const original = Buffer.from(value).toString('utf8') ?? {};
        vscode.workspace.getConfiguration().update('editor.tokenColorCustomizations', JSON.parse(original), true);
      });
    } catch (e) {
      console.error(e);
    }
  }
}
