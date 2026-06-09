import { makeApiRequest } from "./sourceService.js";

const normalizeDownloadQualityList = (qualityList = []) =>
  qualityList.map((quality) => ({
    title: quality.title,
    size: quality.size,
    urls: (quality.urlList || quality.urls || []).map((url) => ({
      title: url.title,
      url: url.url,
    })),
  }));

const normalizeServerQualities = (qualityList = []) =>
  qualityList.map((quality) => ({
    title: quality.title,
    serverList: (quality.serverList || []).map((server) => ({
      title: server.title,
      serverId: server.serverId,
      url: server.url,
    })),
  }));

const deriveDefaultStreamingUrl = (qualities) => {
  for (const quality of qualities) {
    const server = quality.serverList?.find((item) => item.url);
    if (server?.url) return server.url;
  }
  return null;
};

const normalizeDownloads = (downloadUrl = {}) => {
  if (Array.isArray(downloadUrl.formats) && downloadUrl.formats.length > 0) {
    return {
      mode: "formats",
      formats: downloadUrl.formats,
    };
  }

  if (Array.isArray(downloadUrl.qualities) && downloadUrl.qualities.length > 0) {
    return {
      mode: "qualities",
      qualities: downloadUrl.qualities,
    };
  }

  return null;
};

export const fetchEpisodeDetails = async (episodeId) => {
  const response = await makeApiRequest(`/episode/${episodeId}`);
  const details = response.data?.details;
  if (!details) return null;

  const serverQualities = normalizeServerQualities(
    details.server?.qualityList || [],
  );

  const defaultStreamingUrl =
    details.defaultStreamingUrl || deriveDefaultStreamingUrl(serverQualities);

  const episode = {
    ...details,
    defaultStreamingUrl,
    server: { qualities: serverQualities },
    downloadUrl: {
      qualities: normalizeDownloadQualityList(details.download?.qualityList),
    },
  };

  return {
    ...episode,
    standardizedDownloads: normalizeDownloads(episode.downloadUrl),
  };
};

export const fetchServerUrl = async (serverId) => {
  const response = await makeApiRequest(`/server/${serverId}`);
  return response.data?.details?.url || response.data?.url || null;
};
