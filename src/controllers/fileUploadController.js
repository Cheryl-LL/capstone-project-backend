const { Storage } = require("@google-cloud/storage");
const path = require("path");
const {
  uploadFile,
  findFileByClientId,
  findFileById,
  deleteFileById,
} = require("../models/fileModel");

// initialize google cloud
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
});

const bucketName = "capstone-file-upload";
const bucket = storage.bucket(bucketName);
const { v4: uuidv4 } = require("uuid");

// single file upload
async function uploadSingleController(req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;
    // const blob = bucket.file(file.originalname);
    const fileId = uuidv4();
    const blob = bucket.file(fileId);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({
        message: "Error uploading file to Google Cloud Storage.",
        error: err,
      });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileId}`;
      const fileData = {
        clientId: req.body.clientId,
        urlId: fileId,
        fileName: file.originalname,
        filePath: publicUrl,
        fileSize: file.size,
        fileType: file.mimetype,
      };
      uploadFile(fileData, (err, insertId) => {
        if (err) {
          return res.status(500).json({
            message: "Error saving file metadata to the database.",
            error: err,
          });
        }

        // Return the file metadata including the newly inserted file ID
        res.json({
          message: "File successfully uploaded and metadata saved",
          fileUrl: publicUrl,
          fileId: insertId,
        });
      });
    });

    // upload the file
    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Error uploading file.", error });
  }
}

// file delete
const deleteFileController = async (req, res) => {
  const urlId = req.params.urlId;

  try {
    // Step 1: Find the file in the database using urlId
    findFileById(urlId, async (err, files) => {
      if (err) {
        return res.status(500).json({
          message: "Error retrieving file from database.",
          error: err,
        });
      }

      if (!files || files.length === 0) {
        return res
          .status(404)
          .json({ message: "No file found with the given urlId." });
      }

      const fileData = files[0];

      const file = bucket.file(fileData.urlId);
      await file.delete();

      deleteFileById(urlId, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error deleting file from database.",
            error: err,
          });
        }

        res.json({ message: `Successfully deleted file: ${urlId}` });
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting file from Google Cloud Storage.",
      error: err,
    });
  }
};

const getFilesByClientIdController = (req, res) => {
  const clientId = req.params.clientId;

  //find files
  findFileByClientId(clientId, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving files.", error: err });
    }

    if (files.length === 0) {
      return res
        .status(404)
        .json({ message: "No files found for the given clientId." });
    }

    // return file
    res.json({
      files: files,
    });
  });
};

const getFilesByIdController = (req, res) => {
  const urlId = req.params.urlId;

  //find files
  findFileById(urlId, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error retrieving files.", error: err });
    }

    if (files.length === 0) {
      return res
        .status(404)
        .json({ message: "No files found for the given urlId." });
    }

    // return file
    res.json({
      files: files,
    });
  });
};

module.exports = {
  uploadSingleController,
  getFilesByClientIdController,
  getFilesByIdController,
  deleteFileController,
};
