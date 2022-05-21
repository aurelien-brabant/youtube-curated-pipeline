import { spawn } from 'child_process';
import { slugify } from './utils/slugify';
import { YouTubeVideo } from './youtube';
import { getConfig } from './index';

const YOUTUBE_DL_BASE_STRING = 'youtube-dl';

const videoIdToYouTubeUrl = (videoId: string) =>
    `https://www.youtube.com/watch?v=${videoId}`;

export const downloadYouTubeVideo = (
    video: YouTubeVideo,
    callback: (savedVideoPath: string) => void
) => {
    const publishedAtTimestamp = new Date(video.publishedAt).getTime();
    const url = videoIdToYouTubeUrl(video.videoId);
    const outputDirectory = getConfig().outputDirectory;
    const outputTemplate = `${outputDirectory || ''}/${slugify(
        video.channelTitle
    )}/${publishedAtTimestamp}-${slugify(video.title)}.%(ext)s`;
    const process = spawn(YOUTUBE_DL_BASE_STRING, ['-o', outputTemplate, url]);

    process.on('close', (code) => {
        callback(outputTemplate);
    });
};
