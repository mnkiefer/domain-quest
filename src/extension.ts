import * as vscode from 'vscode';
import { ChatParticipant } from './ChatParticipant';
import { NotebookManager } from './NotebookManager';
import { WorkspaceScanner } from './WorkspaceScanner';
import { Logger } from './Logger';

let logger: Logger;

export function activate(context: vscode.ExtensionContext) {
  logger = new Logger('Domain Quest');
  context.subscriptions.push(logger);
  logger.info('Extension "domain-quest" activated.');

  const chatParticipant = new ChatParticipant(context, logger);
  context.subscriptions.push(chatParticipant.create());
  logger.debug('Chat Participant initialized...');

  const scanner = new WorkspaceScanner(logger);

  // Register the "Domain Quest: Run" command
  const disposable = vscode.commands.registerCommand('domainQuest.run', async (uri: vscode.Uri) => {
    logger.debug('Domain Quest command invoked.');

    // Get selected CSV files
    const csvUris = await getSelectedCsvFiles(uri);

    if (csvUris.length === 0) {
      vscode.window.showInformationMessage('Please select one or more CSV files to proceed.');
      return;
    }

    try {
      // Read header data from selected CSV files
      const headerData = await scanner.scanFiles(csvUris);
      await runDomainQuest(chatParticipant, headerData);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error processing data: ${error.message}`);
      logger.error(`Error processing data: ${error.message}`);
    }
  });
  context.subscriptions.push(disposable);

  // Scan the workspace for CSV files upon activation
  scanWorkspaceForCsvFiles(chatParticipant, scanner);
}


async function scanWorkspaceForCsvFiles(chatParticipant: ChatParticipant, scanner: WorkspaceScanner) {
  setTimeout(async () => {
    try {
      // Ensure chatParticipant is initialized
      await chatParticipant.ensureModel();

      const headerData = await scanner.scanWorkspace('**/*.csv');
      if (Object.keys(headerData).length === 0) {
        logger.debug('No CSV files found in the workspace upon activation.');
        return;
      }

      logger.debug('CSV files detected in the workspace.');

      const selection = await vscode.window.showInformationMessage(
        'We detected datasets in your workspace. Would you like to explore them?',
        'Explore',
        'Dismiss',
      );

      if (selection !== 'Explore') {
        return;
      }

      await runDomainQuest(chatParticipant, headerData);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error processing data: ${error.message}`);
      logger.error(`Error processing data: ${error.message}`);
    }
  }, 1000);
}

async function getSelectedCsvFiles(uri: vscode.Uri | undefined): Promise<vscode.Uri[]> {
  if (uri) {
    const stat = await vscode.workspace.fs.stat(uri);
    if (stat.type === vscode.FileType.File && uri.fsPath.endsWith('.csv')) {
      return [uri];
    }
  }

  const selectedUris = (await vscode.window.showOpenDialog({
    canSelectMany: true,
    canSelectFiles: true,
    filters: { 'CSV Files': ['csv'] }
  })) || [];

  return selectedUris;
}

async function runDomainQuest(chatParticipant: ChatParticipant, headerData: any) {
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Domain Quest",
    cancellable: false
  }, async (progress) => {
    progress.report({ increment: 0, message: "Initializing..." });

    // Determine if the domain has a specific (expert) analysis
    const { category, domain } = await chatParticipant.getDomain(headerData);
    progress.report({ increment: 25, message: `Analyzing in "${domain}"...` });

    const notebookJson = await chatParticipant.getAnalysis(headerData, category);
    progress.report({ increment: 50, message: 'Analysis ready...' });

    // Create a new Domain Quest notebook from LLM results
    const notebookManager = new NotebookManager(logger);
    await notebookManager.createNotebook();
    for (const cell of notebookJson.cells) {
      if (cell.cell_type === 'markdown') {
        notebookManager.addMarkdownCell(cell.source.join(''));
      } else if (cell.cell_type === 'code') {
        notebookManager.addCodeCell(cell.source.join(''));
      }
    }
    await notebookManager.saveNotebook();
    progress.report({ increment: 75, message: 'Notebook created...' });

    // Open and run the notebook
    await notebookManager.selectPythonInterpreter();
    await notebookManager.openNotebook();
    await notebookManager.executeNotebook();
    progress.report({ increment: 100, message: 'Notebook ready!' });
  });
}