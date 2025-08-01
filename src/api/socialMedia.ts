const API_BASE_URL = 'http://localhost:4000'; // Update if needed
const DATA_BASE_URL = 'http://localhost:5000'; // Update if needed

function buildUrl(url: string, params: any): string {
    const query = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
    return `${url}${query}`;
}

export const fetchFollowersTrend = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/followers-trend`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchMentionsTrend = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/mentions-trend`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchLikesTrend = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/likes-trend`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchPostsTrend = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/post-trend`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchConversionsTrend = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/conversions-trend`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchCommentsTrend = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/comments-trend`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchTrendingKeywords = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/get-keywords`, params));
        let response = await res.json();
        console.log('Trending keywords response:', response);
        return response
    } catch (error) {
        console.log('Trending keywords error:', error);
        console.error(error);
    }
};

export const fetchConversionsSplits = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/conversions-splits`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchSentimentSplits = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${DATA_BASE_URL}/sentiment`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchAccountInfluencers = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${API_BASE_URL}/account-influencers`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};

export const fetchDataSources = async (params: any) => {
    try {
        const res = await fetch(buildUrl(`${API_BASE_URL}/data-source`, params));
        return await res.json();
    } catch (error) {
        console.error(error);
    }
};
