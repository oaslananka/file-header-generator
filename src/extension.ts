// src/extension.ts
import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	// Komut: Aktif editörde header ekle
	const disposable = vscode.commands.registerCommand('file-header-generator.addHeader', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor detected.');
			return;
		}
		await insertHeader(editor);
	});
	context.subscriptions.push(disposable);

	// Komut: Explorer'da tek dosyaya sağ tıkla
	const singleFileCommand = vscode.commands.registerCommand('file-header-generator.addHeaderToFile', async (uri: vscode.Uri) => {
		const doc = await vscode.workspace.openTextDocument(uri);
		const editor = await vscode.window.showTextDocument(doc, { preview: false });
		await insertHeader(editor);
	});
	context.subscriptions.push(singleFileCommand);

	// Komut: Explorer'da çoklu dosya seçimi (sağ tık menüsünden)
	const multiFileCommand = vscode.commands.registerCommand('file-header-generator.addHeaderToSelection', async (uri: vscode.Uri) => {
		const selectedFiles = await vscode.window.showOpenDialog({
			defaultUri: uri,
			canSelectMany: true,
			openLabel: 'Add Headers',
			filters: {
				'Code Files': ['py', 'js', 'ts', 'cpp', 'c', 'java', 'sh']
			}
		});

		if (!selectedFiles) return;

		for (const file of selectedFiles) {
			const doc = await vscode.workspace.openTextDocument(file);
			const editor = await vscode.window.showTextDocument(doc, { preview: false });
			await insertHeader(editor);
		}
	});
	context.subscriptions.push(multiFileCommand);

	// Hover: dosya üzerine gelince modifikasyon tarihi göster
	context.subscriptions.push(
		vscode.languages.registerHoverProvider(
			['javascript', 'typescript', 'python', 'java', 'c', 'cpp'],
			{
				provideHover(document, position) {
					try {
						const stats = fs.statSync(document.uri.fsPath);
						const modified = stats.mtime;
						const timestamp = modified.toISOString().split('T')[0] + ' ' + modified.toTimeString().split(' ')[0];
						return new vscode.Hover(`🕒 **Last Modified:** ${timestamp}`);
					} catch (err) {
						return undefined;
					}
				}
			}
		)
	);
}

// Ortak header ekleme fonksiyonu
async function insertHeader(editor: vscode.TextEditor) {
	const filename = editor.document.fileName.split(/[\\/]/).pop();
	const filepath = vscode.workspace.asRelativePath(editor.document.fileName);
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.name || 'Unknown Project';
	const now = new Date();
	const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
	const languageId = editor.document.languageId;
	const author = vscode.workspace.getConfiguration('fileHeaderGenerator').get<string>('author') || 'oaslananka';

	const headerLines = [
		`==============================================================================`,
		`Project       : ${workspaceFolder}`,
		`Module Name   : ${filename}`,
		`File Path     : ${filepath}`,
		`File Created  : ${timestamp}`,
		`Author        : ${author}`,
		`Description   : `,
		`==============================================================================`
	];

	const formattedHeader = getCommentBlock(languageId, headerLines) + '\n\n';

	await editor.edit(editBuilder => {
		editBuilder.insert(new vscode.Position(0, 0), formattedHeader);
	});
}

function getCommentBlock(languageId: string, lines: string[]): string {
	switch (languageId) {
		case 'python':
			return `"""\n${lines.join('\n')}\n"""`;
		case 'shellscript':
		case 'powershell':
		case 'bat':
			return lines.map(line => `REM ${line}`).join('\n');
		case 'ruby':
		case 'perl':
		case 'makefile':
			return lines.map(line => `# ${line}`).join('\n');
		case 'html':
		case 'xml':
			return `<!--\n${lines.join('\n')}\n-->`;
		default:
			return `/**\n${lines.map(line => ' * ' + line).join('\n')}\n */`;
	}
}

export function deactivate() { }
