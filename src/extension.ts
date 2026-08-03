const vscode = require('vscode')
const fs = require('fs')
const fsExtra = require('fs-extra')

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearWorkSpaceStorage', async() => {
            const path = context.storagePath.replace(/workspaceStorage.*/g, 'workspaceStorage')
            await listDirectories(path)

            showMsg('workspace storage cleared')
        }),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearGlobalStorage', async() => {
            const path = context.globalStoragePath.replace(/globalStorage.*/, 'globalStorage')
            await listDirectories(path)

            showMsg('global storage cleared')
        }),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openWorkSpaceStorage', async() => {
            const path = context.storagePath.replace('/ctf0.clear-storage', '')

            await openPath(path)
        }),
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openGlobalStorage', async() => {
            const path = context.globalStoragePath.replace(/globalStorage.*/, 'globalStorage')
            await openPath(path)
        }),
    )
}

async function listDirectories(rootPath) {
    const fileNames = await fs.promises.readdir(rootPath, {withFileTypes: true})

    return fileNames.filter((file) => file.isDirectory())
        .map(async({name: dir}) => {
            await fsExtra.remove(`${rootPath}/${dir}`)
        })
}

async function openPath(path) {
    const uri = vscode.Uri.file(path)
    await vscode.env.openExternal(uri)
}

function showMsg(msg) {
    vscode.window.showInformationMessage(`Clear Storage: ${msg}`)
}

function deactivate() { }

module.exports = {
    activate,
    deactivate,
}
