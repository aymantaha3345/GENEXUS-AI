const fs = require('fs');
const path = require('path');

// طريقة آمنة لاستيراد uuid
let uuidv4;
try {
  const { v4 } = require('uuid');
  uuidv4 = v4;
} catch (e) {
  try {
    uuidv4 = require('uuid/v4');
  } catch (err) {
    console.error('Failed to import uuid:', err);
    throw new Error('UUID module not found. Please install uuid package.');
  }
}

class FileService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    
    // إنشاء المجلدات إذا لم تكن موجودة
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log(`Created directory: ${this.uploadDir}`);
    }
  }

  async saveFile(file, subDir = '') {
    try {
      const uniqueName = `${uuidv4()}_${file.name}`;
      const dirPath = path.join(this.uploadDir, subDir);
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      const filePath = path.join(dirPath, uniqueName);
      await fs.promises.writeFile(filePath, file.data);
      
      return {
        path: filePath,
        url: `/uploads/${subDir}/${uniqueName}`,
        name: uniqueName,
        originalName: file.name,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }
}

module.exports = new FileService();
