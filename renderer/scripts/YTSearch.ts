import YouTubeTypeClass from "youtube-sr"
const YouTube = require("youtube-sr").default;

export default class YTSearch {

    private limit: number = 10;
    private searchTerm: string;
    private safeSearch: boolean = false;
    private playlist: any[];
    public arrayVideos: any[];

    private youtube: typeof YouTubeTypeClass = new YouTube()

    constructor(search: string, options?: { limit: number, safeSearch: boolean }) {
        this.searchTerm = search;
        this.limit = (options && options.limit) ? options.limit : this.limit;
        this.safeSearch = (options && options.safeSearch) ? options.safeSearch : this.safeSearch;
    };

    async search() {

        if (this.searchTerm.match("youtu.be/")) {
            const refVideo = this.searchTerm.split("youtu.be/")[1].split("/")[0]
            this.searchTerm = `https://youtube.com/${refVideo.split("?")[0]}`
        }
        if (this.searchTerm.match("&list")) {
            await this.getPlaylist()
            await this.formatVideosPlaylist()
        } else if (this.searchTerm.match("@")) {
            return this.arrayVideos = []
        } else if (this.searchTerm.match("CODE_SEARCH")) {
            await this.getTrendingVideo()
        } else {
            await this.getVideos()
        }

    };

    async getPlaylist() {
        await this.youtube.getPlaylist(this.searchTerm,
            {
                fetchAll: true
            })
            .then((response) => this.playlist = response.videos)
            .catch(console.log)
    }

    async getVideos() {
        await this.youtube.search(this.searchTerm.split(/[&]/g)[0],
            {
                limit: this.limit,
                safeSearch: this.safeSearch,
                type: "video",
            })
            .then((response: Array<any>) => this.arrayVideos = response)
            .catch(console.log)
    }

    async getTrendingVideo() {
        await this.youtube.trending({
            type: this.searchTerm.split("-")[1] as "MUSIC" | "GAMING" | "MOVIES" | "ALL"
        })
            .then((response: Array<any>) => this.arrayVideos = response)
            .catch(console.log)
    }

    async formatVideosPlaylist(){
        console.log(this.playlist)
        const videosArrayInfo = []
        for (const video of this.playlist) {
            this.searchTerm = `youtu.be/${video.id}`
            this.limit = 1
            await this.search()
            for (const v of this.arrayVideos){
                videosArrayInfo.push(v)
            }
        }
        this.arrayVideos = videosArrayInfo
    }

    async request() {
        await this.search()
        return this
    }

}