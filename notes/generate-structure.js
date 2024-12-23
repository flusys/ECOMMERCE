const fs = require('fs');
const path = require('path');

// Get the directory and name from the command-line arguments
const directory = process.argv[2];
const name = process.argv[3];

if (!directory || !name) {
  console.error("Usage: node generate-structure.js <directory> <name>");
  process.exit(1);
}

// Define folder and file structure
const basePath = path.join(directory, name);
const folders = ['components', 'services', 'interfaces'];
const files = {
  interfaces: [
    { name: `${name}-data.interface.ts`, content: `export interface ${capitalize(name)}Data {\n  id: string;\n  name: string;\n}` },
    { name: `${name}-form.interface.ts`, content: `export interface ${capitalize(name)}Form {\n  name: string;\n  description: string;\n}` }
  ],
  services: [
    { name: `${name}-api.service.ts`, content: `import { Injectable } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class ${capitalize(name)}ApiService {\n  constructor() {}\n}` },
    { name: `${name}-state.service.ts`, content: `import { Injectable } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class ${capitalize(name)}StateService {\n  constructor() {}\n}` },
    { name: `${name}-form.service.ts`, content: `import { Injectable } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class ${capitalize(name)}FormService {\n  constructor() {}\n}` }
  ],
  components: [
    { name: `${name}-create.component.ts`, content: `import { Component } from '@angular/core';\n\n@Component({\n  selector: '${name}-create',\n  template: '<p>${name} create works!</p>',\n})\nexport class ${capitalize(name)}CreateComponent {\n}` },
    { name: `${name}-list.component.ts`, content: `import { Component } from '@angular/core';\n\n@Component({\n  selector: '${name}-list',\n  template: '<p>${name} list works!</p>',\n})\nexport class ${capitalize(name)}ListComponent {\n}` }
  ]
};

// Helper function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to create folder
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);
  }
};

// Function to create file
const createFile = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created file: ${filePath}`);
  }
};

// Create the base folder and subfolders
createFolder(basePath);

folders.forEach((subFolder) => {
  const subFolderPath = path.join(basePath, subFolder);
  createFolder(subFolderPath);

  // Create files in subfolders
  (files[subFolder] || []).forEach((file) => {
    const filePath = path.join(subFolderPath, file.name);
    createFile(filePath, file.content || '');
  });
});

console.log("Folder and file structure created successfully.");
