const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeCookiePolicy(lang) {
  const singleType = await client.getByUID('legal-content', 'cookie-policy', { lang: lang });
  console.log(singleType.data);

  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c37-legal-content/data/${lang === 'ru' ? '' : 'kz-'}cookie-policy.yaml`); // change as needed

  const data = getYaml(
    prismicHelper.asText(singleType.data.title),
    prismicHelper.asText(singleType.data.content),
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, content) {
  return {
    heading: {
      text: title
    },
    items: [{
      size: 'small',
      content: content
    }]
  };
}