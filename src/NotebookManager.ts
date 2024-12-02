import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './Logger';
import { PythonExtension } from '@vscode/python-extension';

export class NotebookManager {
  private notebookUri: vscode.Uri;
  private notebookName: string;
  private notebookContent: any;
  private logger: Logger;

  constructor(logger: Logger) {
    const notebookName = this.getNotebookName();
    const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    this.notebookUri = vscode.Uri.file(path.join(workspacePath, notebookName));
    this.notebookName = notebookName;
    this.logger = logger;
  }

  private getNotebookName(): string {
    const baseName = 'domain-quest.ipynb';
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error('No workspace folder found.');
    }
    const workspacePath = workspaceFolders[0].uri.fsPath;
    let notebookName = baseName;
    let counter = 1;
    const ext = path.extname(baseName);
    const basenameWithoutExt = path.basename(baseName, ext);

    while (fs.existsSync(path.join(workspacePath, notebookName))) {
      notebookName = `${basenameWithoutExt}_${counter}${ext}`;
      counter++;
    }
    return notebookName;
  }

  async createNotebook(): Promise<void> {
    this.notebookContent = this.notebookContent = {
      cells: [
        {
          cell_type: 'markdown',
          metadata: {},
          source: [
            '# Domain Quest Analysis\n\n'
          ],
        },
      ],
      metadata: {},
      nbformat: 4,
      nbformat_minor: 2,
    };
    await this.saveNotebook();
  }

  async loadNotebook(): Promise<void> {
    try {
      const existingContent = await vscode.workspace.fs.readFile(this.notebookUri);
      this.notebookContent = JSON.parse(existingContent.toString());
    } catch (error: any) {
      this.logger.error(`Error loading notebook: ${error.message}`);
      throw error;
    }
  }

  addMarkdownCell(content: string): void {
    this.addCell('markdown', content);
  }

  addCodeCell(content: string): void {
    this.addCell('code', content);
  }

  private addCell(cellType: 'markdown' | 'code', content: string): void {
    this.notebookContent.cells.push({
      cell_type: cellType,
      metadata: {},
      source: [`${content}\n`],
    });
  }

  async openNotebook(): Promise<void> {
    await vscode.commands.executeCommand('vscode.openWith', this.notebookUri, 'jupyter-notebook');
  }

  async saveNotebook(): Promise<void> {
    const data = Buffer.from(JSON.stringify(this.notebookContent, null, 2));
    await vscode.workspace.fs.writeFile(this.notebookUri, data);
  }

  async executeNotebook(): Promise<void> {
    await vscode.commands.executeCommand('notebook.execute');
    await vscode.workspace.saveAll();
  }

  async selectPythonInterpreter(): Promise<void> {
    try {
      const pythonExtensionApi = await PythonExtension.api();
      await pythonExtensionApi.ready;
      const activeEnvPromise = pythonExtensionApi.environments.getActiveEnvironmentPath(this.notebookUri);
      const activeEnv = await activeEnvPromise;
      await pythonExtensionApi.environments.updateActiveEnvironmentPath(activeEnv.path);
    } catch (error: any) {
      this.logger.error(`Error selecting Python interpreter: ${error.message}`);
      throw error;
    }
  }

}