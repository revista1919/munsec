const fs = require('fs');
const path = require('path');

function convertImagesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplaza <img src="/..."> con <Image ...>
  content = content.replace(
    /<img\s+src="([^"]+)"\s+alt="([^"]+)"([^>]*)>/g,
    (match, src, alt, rest) => {
      // Si tiene className, la preservamos
      const classNameMatch = rest.match(/className="([^"]+)"/);
      const className = classNameMatch ? classNameMatch[1] : '';
      
      // Determinar si es imagen de fondo (fill) o normal
      if (rest.includes('object-cover') || rest.includes('w-full h-full')) {
        return `<Image src="${src}" alt="${alt}" fill className="${className}" />`;
      } else {
        return `<Image src="${src}" alt="${alt}" width={800} height={600} className="${className}" />`;
      }
    }
  );
  
  // Agrega import si no existe
  if (!content.includes("import Image from 'next/image'")) {
    content = content.replace(
      /import\s+{([^}]+)}\s+from\s+['"]framer-motion['"]/,
      "import Image from 'next/image';\nimport { $1 } from 'framer-motion'"
    );
  }
  
  fs.writeFileSync(filePath, content);
}

// Procesa todos los archivos .jsx y .tsx en /app
const appDir = path.join(__dirname, 'app');
const files = fs.readdirSync(appDir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.js'));

files.forEach(file => {
  convertImagesInFile(path.join(appDir, file));
  console.log(`✅ Convertido: ${file}`);
});