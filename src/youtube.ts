import axios from 'axios';
import { URLSearchParams } from 'url';

const YOUTUBE_DATA_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export type YouTubeVideo = {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
    videoId: string;
};

export const queryYoutubeDataApi = async (
    endpoint: string,
    queryParameters: { [key: string]: any } = {}
) => {
    const searchParams = new URLSearchParams();

    searchParams.set('key', YOUTUBE_API_KEY as string);

    for (const paramName in queryParameters) {
        searchParams.set(paramName, String(queryParameters[paramName]));
    }

    return axios.get(
        `${YOUTUBE_DATA_API_BASE_URL}${endpoint}?${searchParams.toString()}`
    );
};

export const getLastChannelVideos = async (channelId: string) => {
    const {
        data: { items: fetchedVideos },
    } = await queryYoutubeDataApi('/search', {
        part: 'snippet',
        channelId,
        order: 'date',
        maxResults: 2,
    });

    const videos = fetchedVideos.map(
        ({ snippet, kind, etag, id, ...fetchedVideo }: any) => {
            const { thumbnails, ...usefulSnippetData } = snippet;

            return {
                ...fetchedVideo,
                ...usefulSnippetData,
                videoId: id.videoId,
            };
        }
    ) as YouTubeVideo[];

    return videos;
};
