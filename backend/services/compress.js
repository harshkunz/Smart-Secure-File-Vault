const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

// Promisify zlib methods
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

class CompressionService {
    static async compressFile(inputPath) {
        try {
            const baseName = path.parse(inputPath).name;
            const outputPath = path.join(path.dirname(inputPath), `${baseName}.gz`);

            const input = await fs.readFile(inputPath);
            const compressed = await gzip(input);

            await fs.writeFile(outputPath, compressed);
            const stats = await fs.stat(outputPath);

            return {
                success: true,
                compressedSize: stats.size,
                compressedPath: outputPath
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = CompressionService;
