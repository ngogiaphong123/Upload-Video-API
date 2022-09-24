import { StatusCodes } from 'http-status-codes';
import busboy from "busboy"
import fs from "fs";
import { Request, Response } from "express"
import { createVideo, findVideo, findVideos } from "./video.service";
import { Video } from './video.model';
import { UpdateVideoParams, UpdateVideoBody } from './video.schema';
//? MIME : Multipurpose Internet Mail Extensions or MIME type
const CHUNK_SIZE_IN_BYTES = 1000000;
const MIME_TYPES = ['video/mp4']
function getPath({videoId, extension} : {
    videoId : Video['videoId'],
    extension : Video['extension']
}) {
    return `${process.cwd()}/videos/${videoId}.${extension}`;
}
export async function uploadVideoHandler(req : Request,res : Response) {
    const bb = busboy({headers : req.headers});
    const user = res.locals.user;
    const video = await createVideo({owner : user._id});
    bb.on('file', async(_,file,info) => {
        if(!MIME_TYPES.includes(info.mimeType)) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid file type");
        }
        const extension = info.mimeType.split('/')[1];
        const filePath = getPath({videoId : video.videoId,
            extension : extension
        });
        video.extension = extension;
        await video.save();
        const stream = fs.createWriteStream(filePath);
        file.pipe(stream);
    })
    bb.on('close' , () => {
        res.writeHead(StatusCodes.CREATED, {
            'Connection': 'close',
            'content-type': 'application/json'
        })
        res.write(JSON.stringify(video));
        res.end();
    })
    return req.pipe(bb);
}

export async function updateVideoHandler(
    req : Request <UpdateVideoParams,{},UpdateVideoBody>,
    res : Response
) {
    const { videoId } = req.params;
    const { title, description, published } = req.body;
    const {_id : userId} = res.locals.user;
    const video = await findVideo(videoId);
    if(!video) return res.status(StatusCodes.NOT_FOUND).send('Video not found');
    if(video.owner?.toString() !== String(userId)) return res.status(StatusCodes.UNAUTHORIZED).send('Unauthorized');
    video.title = title;
    video.description = description;
    video.published = published;
    await video.save();
    return res.status(StatusCodes.OK).send(video);
}
export async function findVideosHandler(_: Request , res : Response) {
    const videos = await findVideos();
    return res.status(StatusCodes.OK).send(videos);
}

export async function streamVideoHandler(req : Request,res : Response) {
    const {videoId} = req.params
    const range = req.headers.range;
    if(!range) return res.status(StatusCodes.BAD_REQUEST).send('Range header is required');
    const video = await findVideo(videoId);
    if(!video) return res.status(StatusCodes.NOT_FOUND).send('Video not found')
    const filePath = getPath({videoId : video.videoId, extension : video.extension});
    const fileSizeInBytes = fs.statSync(filePath).size;
    const chunkStart = Number(range.replace(/\D/g, ''));
    const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, fileSizeInBytes - 1);
    const contentLength = chunkEnd - chunkStart + 1;
    const headers = {
        "Content-Range" : `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : `video/${video.extension}`,
        // "Cross-Origin-Resource-Policy" : "cross-origin"
    }
    res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);
    const videoStream = fs.createReadStream(filePath, {
        start : chunkStart,
        end : chunkEnd
    })
    videoStream.pipe(res);
}