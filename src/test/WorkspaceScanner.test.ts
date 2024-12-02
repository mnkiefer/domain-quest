import * as assert from 'assert';
import { WorkspaceScanner } from '../WorkspaceScanner';
import { Logger } from '../Logger';

suite('WorkspaceScanner Test Suite', () => {
    const logger = new Logger('Test Logger');
    const scanner = new WorkspaceScanner(logger);

    test('WorkspaceScanner should scan and analyze CSV files', async () => {
        const headerData = await scanner.scanWorkspace('**/*.csv');
        assert.ok(headerData, 'Workspace scanned.');

        const filePath = 'data/test.csv';
        const columnInfo = await scanner.analyzeCSV(filePath);
        assert.ok(columnInfo, 'CSV file analyzed.');
    });
});