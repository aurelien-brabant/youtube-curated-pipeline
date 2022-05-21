import { readFileSync } from "fs"

export type ConfigurationFile = {
    youtubeChannels: Array<{
        channelId: string;
    }>
    outputDirectory?: string;
    activationInterval: string;
    name?: string;
}

export const loadConfig = (configPath: string) => {
    const buffer = readFileSync(configPath);
    const json = JSON.parse(buffer.toString())

    return json as ConfigurationFile;
}