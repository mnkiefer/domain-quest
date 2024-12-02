import * as vscode from 'vscode';
import path from 'path';

import { promises as fsp } from 'fs';
import { Logger } from './Logger';

const MODEL = 'gpt-4o';
const VENDOR = 'copilot';

interface IChatParticipantChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

export class ChatParticipant {
  private model: vscode.LanguageModelChat | null = null;
  private logger: Logger;

  constructor(private context: vscode.ExtensionContext, logger: Logger) {
    this.logger = logger;
  }

  public async ensureModel(): Promise<vscode.LanguageModelChat> {
    if (this.model) {
      return this.model;
    }
  
    const maxAttempts = 20;
    const delay = 1000;
  
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (!vscode.lm) {
          throw new Error('Language model API is not available. Please ensure that the required extensions are installed and activated.');
        }
        const models = await vscode.lm.selectChatModels({ vendor: VENDOR, family: MODEL });
        if (models && models.length > 0) {
          this.model = models[0];
          return this.model;
        } else {
          throw new Error('No suitable language models available.');
        }
      } catch (error) {
        if (attempt < maxAttempts) {
          this.logger.error(`Attempt ${attempt} failed: ${error}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          this.logger.error('Model initialization failed after maximum attempts.');
          throw error;
        }
      }
    }
    throw new Error('No suitable model found after retries.');
  }

  public async getDomain(headerData: any): Promise<any> {
    const categories = JSON.parse(await fsp.readFile(path.resolve(__dirname, 'prompts', 'categories.json'), 'utf8'));

    const prompt = (await fsp.readFile(path.resolve(__dirname, 'prompts/getDomain.md'), 'utf8'))
      .replace('{{HEADER_DATA}}', JSON.stringify(headerData))
      .replace('{{CATEGORIES}}', Object.keys(categories).map((category: string) => `${category}`).join(', '));
    const { domain, reason, category }= await this.query(prompt);

    this.logger.debug(`Domain: "${domain}"`);
    this.logger.debug(`Reason: ${reason}.`);
    return { category, domain };
  }

  public async getAnalysis(headerData: any, category: string = 'Other'): Promise<any> {
    let prompt;

    if (category === 'Other') {
      prompt = (await fsp.readFile(path.resolve(__dirname, 'prompts/getAnalysis.md'), 'utf8'))
        .replace('{{HEADER_DATA}}', JSON.stringify(headerData));
    } else {
      const analysis = await fsp.readFile(path.resolve(__dirname, 'prompts', `${category}.md`), 'utf8');
      prompt = (await fsp.readFile(path.resolve(__dirname, `prompts/getCategoryAnalysis.md`), 'utf8'))
        .replace('{{HEADER_DATA}}', JSON.stringify(headerData))
        .replace('{{ANALYSIS}}', analysis);
    }
      const responseJson = await this.query(prompt);

    this.logger.debug(`Analysis response: ${JSON.stringify(responseJson)}`);
    return responseJson;
  }

  public async query(prompt: string): Promise<{ domain: string, reason: string, category: string }> {
    const model = await this.ensureModel();
    const messages = [vscode.LanguageModelChatMessage.User(prompt)];

    try {
      const chatResponse = await model.sendRequest(messages);
      let responseString = '';
      for await (const fragment of chatResponse.text) {
        responseString += fragment;
      }
      const match = responseString.match(/```json\n([\s\S]*?)\n```/);
      if (!match) {
        const error = 'No JSON code block found in the response';
        await vscode.window.showErrorMessage(error);
        throw new Error(error);
      }
      const responseJson = JSON.parse(match[1]);
      return responseJson;
    } catch (error: any) {
      throw error;
    }
  }

  public create(): vscode.ChatParticipant {
    const handler: vscode.ChatRequestHandler = async (
      request: vscode.ChatRequest,
      _context: vscode.ChatContext,
      stream: vscode.ChatResponseStream,
      token: vscode.CancellationToken,
    ): Promise<IChatParticipantChatResult> => {
      try {
        const model = await this.ensureModel();
        const messages = [vscode.LanguageModelChatMessage.User(request.prompt)];
        const chatResponse = await model.sendRequest(messages, {}, token);
        for await (const fragment of chatResponse.text) {
          stream.markdown(fragment);
        }
      } catch (err) {
        this.handleError(err, stream);
      }
      return { metadata: { command: '' } };
    };

    const chatParticipant = vscode.chat.createChatParticipant(
      'copilot.datadiscoverer',
      handler,
    );

    chatParticipant.iconPath = {
      light: vscode.Uri.file(
        path.join(this.context.extensionUri.fsPath, 'images', 'domain-quest-light.jpg')
      ),
      dark: vscode.Uri.file(
        path.join(this.context.extensionUri.fsPath, 'images', 'domain-quest-dark.jpg')
      ),
    };
    return chatParticipant;
  }

  private handleError(
    err: unknown,
    stream: vscode.ChatResponseStream,
  ): void {
    if (err instanceof vscode.LanguageModelError) {
      this.logger.info(err.message);
      if (err.cause instanceof Error && err.cause.message.includes('off_topic')) {
        stream.markdown("I'm sorry, I can only explain computer science concepts.");
      }
    } else {
      if (err instanceof Error) {
        console.error(err.name, err);
      }
      throw err;
    }
  }
}