import * as vscode from 'vscode'
import fs from 'fs'
import fsExtra from 'fs-extra'

async function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearWorkSpacesStorage', async() => {
            const path = context.storageUri?.fsPath.replace(/workspaceStorage.*/g, 'workspaceStorage')
            await listDirectories(path)

            showMsg('workspaces storage cleared')
        }),
        vscode.commands.registerCommand('extension.clearCurrentWorkSpaceStorage', async() => {
            const path = context.storageUri?.fsPath.replace('/ctf0.clear-storage', '')

            await listDirectories(path)

            showMsg('current workspace storage cleared')
        }),
        vscode.commands.registerCommand('extension.clearGlobalStorage', async() => {
            const path = context.globalStorageUri?.fsPath.replace(/globalStorage.*/, 'globalStorage')
            await listDirectories(path)

            showMsg('global storage cleared')
        }),
        // open
        vscode.commands.registerCommand('extension.openWorkSpaceStorage', async() => {
            const path = context.storageUri?.fsPath.replace('/ctf0.clear-storage', '')

            await openPath(path)
        }),
        vscode.commands.registerCommand('extension.openGlobalStorage', async() => {
            const path = context.globalStorageUri?.fsPath.replace(/globalStorage.*/, 'globalStorage')
            await openPath(path)
        }),
    )
}

async function listDirectories(rootPath) {
    const fileNames = await fs.promises.readdir(rootPath, {withFileTypes: true})

    return fileNames
        .filter((file) => file.isDirectory())
        .map(async({name: dir}) => {
            await fsExtra.remove(`${rootPath}/${dir}`)
        })
}

async function openPath(path) {
    const uri = vscode.Uri.file(path)
    await vscode.env.openExternal(uri)
}

function showMsg(msg) {
    vscode.window.showInformationMessage(msg)
}

function deactivate() { }

module.exports = {
    activate,
    deactivate,
}
