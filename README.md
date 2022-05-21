# Curated YouTube Pipeline

Download YouTube videos from whitelisted channels as they are getting uploaded so that you can consume your favorite content ahead of YouTube.

# Disclaimer

Not ready for use as of now.
I'm making this for my own needs in the first place.

# Getting started

## Prerequisites

-   The `youtube-dl` command-line utility
-   `node` (NodeJS) >= 14

First, transpile the Typescript codebase to Javascript:

```sh
yarn build
```

Then run the app:

```
yarn start PATH_TO_YOUR_CONFIG_FILE
```

You need to pass the path to your config file as the third argument. See [how to configure](#configuration)

# Configuration

## Environment

Before running the app you need to make sure you have the `YOUTUBE_API_KEY` environment variable set to your actual YouTube Data API v3 key.

Calls to the YouTube API are made to get the recently uploaded videos from each configured channel.

## Global configuration

Configuration is loaded from a `JSON` file with a specific format.
Here is a Typescript definition of the configuration file (which you can translate into proper JSON)

```ts
export type ConfigurationFile = {
    youtubeChannels: Array<{
        channelId: string;
    }>;
    outputDirectory?: string;
    activationInterval: string;
    name?: string;
};
```

A few points to highlight here:

-   The `activationInterval` determines how often the youtube channels are going to be scanned and new videos downloaded. You can put any value that can be parsed by the [ms](https://github.com/vercel/ms) package.

-   `activationInterval` should be greater or equal to 5 minutes.

-   You can specify as much channels as you want in the youtubeChannels array but keep in mind that for each fetch, `n` requests to the YouTube API will be made. You need to make sure that you, accordingly with your `activationInterval`, don't exceed the YouTube API's rate limit.

-   Videos will be put in separate directories that are named after the original channel name. Each video is prefixed by its publication timestamp so that it's easy to sort them easily using for example `sort -n`.

-   You are highly encouraged to set a custom `outputDirectory` otherwise videos will be downloaded in the current directory where this software has been started.
