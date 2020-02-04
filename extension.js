const vscode = require('vscode')
const fs = require('fs')
const fsExtra = require('fs-extra')

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearWorkSpaceStorage', async () => {
            let path = context.storagePath.replace(/workspaceStorage.*/g, 'workspaceStorage')
            await listDirectories(path)

            showMsg('workspace storage cleared')
        })
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearGlobalStorage', async () => {
            let path = context.globalStoragePath.replace(/globalStorage.*/, 'globalStorage')
            await listDirectories(path)

            showMsg('global storage cleared')
        })
    )
}

async function listDirectories(rootPath) {
    const fileNames = await fs.promises.readdir(rootPath, { withFileTypes: true })

    return fileNames.filter((file) => file.isDirectory())
        .map(async ({ name: dir }) => {
            await fsExtra.remove(`${rootPath}/${dir}`)
        })
}

function showMsg(msg) {
    vscode.window.showInformationMessage(`Clear Storage: ${msg}`)
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
