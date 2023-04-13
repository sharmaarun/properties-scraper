import { readdirSync } from "fs"
import { resolve } from "path"

/**
 * Returns a list of all typescript files (.ts) in a directory recusively
 * traversing the directories
 */
export const getTypescriptFiles = (path: string, dir: string): string[] => {
    const files = readdirSync(resolve(path, dir), { withFileTypes: true })
    const tsFiles: string[] = []
    files.forEach(file => {
        if (file.isDirectory()) {
            tsFiles.push(...getTypescriptFiles(resolve(path, dir), file.name))
        } else if (file.isFile() && file.name.endsWith(".ts")) {
            tsFiles.push(`${dir}/${file.name}`)
        }
    })
    return tsFiles
}

/**
 * Replaces variables in a string with pattern ${variable}
 */
export const replaceVariables = (str: string, variables: any) => {
    return str.replace(/\${(.*?)}/g, (match, variable) => {
        return variables[variable]
    })
}