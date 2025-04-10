const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeFiles3(lang) {
  const singleType = await client.getByUID('files', 'files-3', { lang: lang });
  console.log(singleType.data);

  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c75-image-grid/data/files-3${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  const data = getYaml(
    prismicHelper.asText(singleType.data.title),
    singleType.data.files,
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, items) {
  return {
    title: {
      heading: {
        text: title,
        size: 'h4'
      }
    },
    items: items.map((item) => ({
      heading: {
        text: prismicHelper.asText(item.heading),
      },
      description: prismicHelper.asText(item.description),
      link: {
        href: item.link.url,
        label: prismicHelper.asText(item['link-label']),
      }
    }))
  };
}