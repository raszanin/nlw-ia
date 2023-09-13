import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";
import { pipeline } from "node:stream";
import { promisify } from "util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 1_048_576 * 25, // 25MB
    },
  });

  app.post("/videos", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({
        error: "No file uploaded",
      });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".mp3") {
      return reply.status(400).send({
        error: "Invalid file typess",
      });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;
    const uploadDestination = path.resolve(
      __dirname,
      "..",
      "..",
      "uploads",
      fileUploadName
    );

    console.log(uploadDestination);

    await pump(data.file, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        nome: data.filename,
        path: uploadDestination,
      },
    });

    return reply.status(200).send({ file: fileUploadName, video });
  });
}
