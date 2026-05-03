const fs = require('fs');
const path = require('path');

const srcComponentsDir = path.join(__dirname, 'src', 'components');
if (!fs.existsSync(srcComponentsDir)) {
  fs.mkdirSync(srcComponentsDir, { recursive: true });
}

['V1.jsx', 'V2.jsx', 'V3.jsx', 'V4.jsx'].forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, 'components', file), 'utf-8');
  let newContent = `import React, { useState, useEffect, useMemo } from 'react';\n` +
                   `import { PROJECTS, PROFILE } from '@/data/projects';\n\n` + content;
                   
  newContent = newContent.replace(/window\.PROJECTS/g, 'PROJECTS');
  newContent = newContent.replace(/window\.PROFILE/g, 'PROFILE');
  newContent = newContent.replace(/const projects = window\.PROJECTS;/g, 'const projects = PROJECTS;');
  newContent = newContent.replace(/const profile = window\.PROFILE;/g, 'const profile = PROFILE;');
  
  // Make sure to export default
  const componentName = file.replace('.jsx', '');
  newContent = newContent.replace(`window.${componentName} = ${componentName};`, `export default ${componentName};`);
  
  fs.writeFileSync(path.join(srcComponentsDir, file), newContent);
});

console.log("Components migrated successfully");
