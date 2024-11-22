const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');
const notFoundPath = path.join(__dirname, 'dist', '404.html');

let indexContent = fs.readFileSync(indexPath, 'utf8');

const redirectScript = `
<script>
    if (location.pathname !== '/ynlb/') {
        location.replace('/ynlb/');
    }
</script>
`;
indexContent = indexContent.replace('</body>', `${redirectScript}</body>`);

fs.writeFileSync(notFoundPath, indexContent);
console.log('404.html generated successfully.');