import ms from 'ms';

import { ConfigurationFile, loadConfig } from './config';
import { fatalError } from './error';
import { getLastChannelVideos } from './youtube';
import { downloadYouTubeVideo } from './download';

let config: ConfigurationFile | null = null;

export const getConfig = () => config as ConfigurationFile;

const boostrap = async () => {
    const configFilePath = process.argv[2];

    if (configFilePath === undefined) {
        fatalError('missing path to configuration file');
    }

    config = loadConfig(configFilePath);

    const interval = ms(getConfig().activationInterval);

    if (interval < ms('5m')) {
        fatalError(
            'Activation interval must be greater or equal to 5 minutes.'
        );
    }

    const channels = getConfig().youtubeChannels;

    console.info(
        `Started monitoring on ${channels.length} channel${
            channels.length > 1 ? 's' : ''
        } (activationInterval=${getConfig().activationInterval})`
    );

    setInterval(async () => {
        for (const channel of channels) {
            const videos = await getLastChannelVideos(channel.channelId);

            for (const video of videos) {
                console.log('Downloading ', video.title);
                downloadYouTubeVideo(video, (name) => {
                    console.log('Saved at', name);
                });
            }
        }
    }, interval);
};

boostrap();
