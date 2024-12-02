import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from './Logger';

const dfd = require("danfojs-node");

export class WorkspaceScanner {
  /**
   * Scans the workspace for CSV files matching the scanPattern and extracts their headers.
   *
   * @param scanPattern - Glob pattern to match CSV files.
   * @returns A promise that resolves to an object mapping file paths to their headers.
   */
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async scanWorkspace(scanPattern: string): Promise<{ [filePath: string]: Object }> {
    const headerData: { [filePath: string]: Object } = {};
    try {
      const files = await vscode.workspace.findFiles(scanPattern);
      this.logger.debug(`Found ${files.length} file(s) matching the pattern "${scanPattern}".`);
      if (files.length === 0) {
        this.logger.debug('No matching files found in the workspace.');
        return headerData;
      }
      for (const file of files) {
        const filePath = file.fsPath;
        this.logger.debug(`Scanning file: ${filePath}`);
        try {
          const headers: any = await this.analyzeCSV(filePath);
          headerData[filePath] = headers;
          this.logger.debug(`Headers found in ${filePath}: ${JSON.stringify(headers)}`);
        } catch (error) {
          console.error(`Error scanning file ${filePath}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      console.error(`Error while scanning the workspace: ${(error as Error).message}`);
    }
    if (Object.keys(headerData).length === 0) {
      this.logger.info('No CSV files found in the workspace.');
      return {};
    }
    return headerData;
  }

  public async scanFiles(fileUris: vscode.Uri[]): Promise<any> {
    const headerData: any = {};

    for (const uri of fileUris) {
      try {
        const content = await fs.readFile(uri.fsPath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) continue;

        const headers = lines[0].split(',').map(h => h.trim());
        headerData[path.basename(uri.fsPath)] = headers;
      } catch (error: any) {
        this.logger.error(`Error reading file ${uri.fsPath}: ${error.message}`);
      }
    }

    return headerData;
  }

  async analyzeCSV(filePath: string): Promise<{ [key: string]: any }> {
    const columnInfos: { [key: string]: any } = {};
    try {
      const df = await dfd.readCSV(filePath);

      df.columns.forEach((col: any) => {
        columnInfos[col] = {
          name: col,
          type: df[col].dtype
        };
      });
      this.logger.info("\nCollected Column Infos:");
      this.logger.info(JSON.stringify(columnInfos, null, 2));
    } catch (err) {
      console.error("Error analyzing CSV:", err);
    }
    return columnInfos;
  }
}