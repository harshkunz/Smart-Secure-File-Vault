const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

// Promisify gunzip
const gunzip = promisify(zlib.gunzip);

class DecompressionService {
    static async decompressFile(inputPath) {
        try {
            // Validate input file
            if (!inputPath.endsWith('.gz')) {
                throw new Error('Invalid file format. Expected a .gz file');
            }

            // Set up file paths
            const fileName = path.basename(inputPath, '.gz');
            const outputPath = path.join(path.dirname(inputPath), fileName);

            // Read and decompress
            const compressed = await fs.readFile(inputPath);
            const decompressed = await gunzip(compressed);

            // Write decompressed file
            await fs.writeFile(outputPath, decompressed);
            const stats = await fs.stat(outputPath);

            return {
                success: true,
                decompressedPath: outputPath,
                originalSize: compressed.length,
                decompressedSize: stats.size
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = DecompressionService;
