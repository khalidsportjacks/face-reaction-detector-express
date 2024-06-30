import express from "express";
import { pipeline } from "@xenova/transformers";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

let classifier;

// Initialize the pipeline
async function initializePipeline() {
  try {
    classifier = await pipeline(
      "image-classification",
      "Xenova/facial_emotions_image_detection"
    );
    console.log("Pipeline initialized successfully");
  } catch (error) {
    console.error("Error initializing pipeline:", error);
  }
}

await initializePipeline();

// Helper to get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint to handle image classification
app.post("/classify", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }

  if (!classifier) {
    return res.status(500).send("Pipeline not initialized");
  }

  try {
    console.log(`Processing image from URL: ${imageUrl}`);

    // Download the image
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageData = response.data;

    // Save the image locally
    const imagePath = path.join(__dirname, "temp_image.png");
    await fs.writeFile(imagePath, Buffer.from(imageData));

    // Classify the image
    const output = await classifier(imagePath);
    console.log(output);

    res.json(output);
  } catch (error) {
    console.error("Error classifying image:", error);
    res.status(500).send("An error occurred while classifying the image");
  } finally {
    // Clean up the temporary image file
    const imagePath = path.join(__dirname, "temp_image.png");
    await fs.unlink(imagePath);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
