import { VideoModel } from "./video.model";

export function createVideo({owner} : {owner : string}) {
    return VideoModel.create({owner});
}
export function findVideo(videoId : string) {
    return VideoModel.findOne({videoId});
}

export function findVideos() {
    return VideoModel.find({
        published : true
    }).lean();
}