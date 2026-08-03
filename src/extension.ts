import * as vscode from 'vscode'
import fs from 'fs'
import fsExtra from 'fs-extra'

async function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.clearWorkSpacesStorage', async() => {
            try {
                await removeSubdirectories(getWorkSpacesStoragePath(context))
                showMsg('workspaces storage cleared')
            } catch {
                showMsg('Failed to clear workspaces storage')
            }
        }),
        vscode.commands.registerCommand('extension.clearCurrentWorkSpaceStorage', async() => {
            try {
                await removeDirectory(getCurrentWorkSpaceStoragePath(context))
                showMsg('current workspace storage cleared')
            } catch {
                showMsg('Failed to clear current workspace storage')
            }
        }),
        vscode.commands.registerCommand('extension.clearGlobalStorage', async() => {
            try {
                await removeSubdirectories(getGlobalStoragePath(context))
                showMsg('global storage cleared')
            } catch {
                showMsg('Failed to clear global storage')
            }
        }),
        vscode.commands.registerCommand('extension.openCurrentWorkSpaceStorage', async() => {
            try {
                await openPath(getCurrentWorkSpaceStoragePath(context))
            } catch {
                showMsg('Failed to open workspace storage')
                await openPath(getWorkSpacesStoragePath(context))
            }
        }),
        vscode.commands.registerCommand('extension.openGlobalStorage', async() => {
            await openPath(getGlobalStoragePath(context))
        }),
    )
}

function getWorkSpacesStoragePath(context: vscode.ExtensionContext): string | undefined {
    return context.storageUri?.fsPath.replace(/workspaceStorage.*/g, 'workspaceStorage')
}

function getCurrentWorkSpaceStoragePath(context: vscode.ExtensionContext): string | undefined {
    return context.storageUri?.fsPath.replace(`/${context.extension.id}`, '')
}

function getGlobalStoragePath(context: vscode.ExtensionContext): string {
    return context.globalStorageUri.fsPath.replace(/globalStorage.*/, 'globalStorage')
}

async function removeDirectory(rootPath: string | undefined) {
    await assertPathExists(rootPath)

    await fsExtra.remove(rootPath)
}

async function removeSubdirectories(rootPath: string | undefined) {
    await assertPathExists(rootPath)

    const fileNames = await fs.promises.readdir(rootPath, {withFileTypes: true})

    await Promise.all(
        fileNames
            .filter((file) => file.isDirectory())
            .map(({name: dir}) => fsExtra.remove(`${rootPath}/${dir}`))
    )
}

async function openPath(path: string | undefined) {
    await assertPathExists(path)

    const uri = vscode.Uri.file(path)
    await vscode.env.openExternal(uri)
}

async function assertPathExists(path: string | undefined) {
    if (!await pathExists(path)) {
        throw new Error('path does not exist')
    }
}

async function pathExists(path: string | undefined) {
    try {
        await fs.promises.access(path)

        return true
    } catch {
        return false
    }
}

function showMsg(msg: string) {
    vscode.window.showInformationMessage(msg)
}

function deactivate() { }

module.exports = {
    activate,
    deactivate,
}
