const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class EncryptionService {
    static algorithm = 'aes-256-cbc';
    static keyLength = 32; // 256 bits
    static ivLength = 16;  // 128 bits

    static async generateKey() {
        return crypto.randomBytes(this.keyLength);
    }

    static async generateIV() {
        return crypto.randomBytes(this.ivLength);
    }

    static async encryptFile(inputPath) {
        try {
            const key = await this.generateKey();
            const iv = await this.generateIV();
            const cipher = crypto.createCipheriv(this.algorithm, key, iv);

            const fileName = path.basename(inputPath);
            const outputPath = path.join(
                path.dirname(inputPath), 
                `${fileName}.enc`
            );

            const input = await fs.readFile(inputPath);
            const encrypted = Buffer.concat([
                cipher.update(input),
                cipher.final()
            ]);

            // Prepend IV and key to encrypted data
            const final = Buffer.concat([iv, key, encrypted]);
            await fs.writeFile(outputPath, final);

            return {
                success: true,
                encryptedPath: outputPath,
                originalSize: input.length,
                encryptedSize: final.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = EncryptionService;