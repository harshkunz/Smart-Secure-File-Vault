const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class DecryptionService {
    static algorithm = 'aes-256-cbc';
    static keyLength = 32; // 256 bits
    static ivLength = 16;  // 128 bits

    static async decryptFile(inputPath) {
        try {
            const encrypted = await fs.readFile(inputPath);

            if (encrypted.length < this.ivLength + this.keyLength) {
                throw new Error('Invalid encrypted file format.');
            }

            const iv = encrypted.slice(0, this.ivLength);
            const key = encrypted.slice(this.ivLength, this.ivLength + this.keyLength);
            const data = encrypted.slice(this.ivLength + this.keyLength);

            const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
            const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

            const fileName = path.basename(inputPath, '.enc');
            const outputPath = path.join(path.dirname(inputPath), fileName);

            await fs.writeFile(outputPath, decrypted);

            return {
                success: true,
                decryptedPath: outputPath,
                originalSize: encrypted.length,
                decryptedSize: decrypted.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = DecryptionService;
