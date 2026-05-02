const fs = require("fs/promises");
const path = require("path");
const poppler = require("pdf-poppler");

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertPdfFirstPageToImage(pdfPath) {
  const outputDir = path.dirname(pdfPath);
  const outputPrefix = `${path.basename(pdfPath, path.extname(pdfPath))}-page`;

  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: outputPrefix,
    page: 1,
  };

  if (process.env.POPPLER_PATH) {
    options.poppler_path = process.env.POPPLER_PATH;
  }

  try {
    await poppler.convert(pdfPath, options);
  } catch (error) {
    const details = error && error.message ? ` Details: ${error.message}` : "";
    throw new Error(
      `Could not convert PDF first page to image. Install Poppler or set POPPLER_PATH.${details}`
    );
  }

  const likelyPaths = [
    path.join(outputDir, `${outputPrefix}-1.png`),
    path.join(outputDir, `${outputPrefix}-01.png`),
  ];

  for (const imagePath of likelyPaths) {
    if (await pathExists(imagePath)) {
      return imagePath;
    }
  }

  const files = await fs.readdir(outputDir);
  const generated = files.find((file) => file.startsWith(outputPrefix) && file.endsWith(".png"));

  if (!generated) {
    throw new Error("PDF conversion completed but no image was generated.");
  }

  return path.join(outputDir, generated);
}

module.exports = { convertPdfFirstPageToImage };
