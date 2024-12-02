import * as vscode from 'vscode';

/**
 * Logger class for tracing and logging messages with different severity levels.
 */
export class Logger {
  private channel: vscode.OutputChannel;

  constructor(name: string) {
    this.channel = vscode.window.createOutputChannel(name);
    //this.channel.show(true);
    this.channel.appendLine(`${new Date().toISOString()} - Logger initialized.`);
  }

  trace(message: string) {
    this.channel.appendLine(`${new Date().toISOString()} [TRACE] ${message}`);
  }

  debug(message: string) {
    this.channel.appendLine(`${new Date().toISOString()} [DEBUG] ${message}`);
  }

  info(message: string) {
    this.channel.appendLine(`${new Date().toISOString()} [INFO] ${message}`);
  }

  warn(message: string) {
    this.channel.appendLine(`${new Date().toISOString()} [WARN] ${message}`);
  }

  error(message: string) {
    this.channel.appendLine(`${new Date().toISOString()} [ERROR] ${message}`);
  }

  dispose() {
    this.channel.appendLine(`${new Date().toISOString()} - Logger disposed.`);
    this.channel.dispose();
  }
}