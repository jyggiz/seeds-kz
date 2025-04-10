const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeGoals(lang) {
  const singleType = await client.getByUID('goals', 'goals', { lang: lang });
  console.log(singleType.data.items);


  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c38-windows/data/seeds${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  const data = getYaml(
    prismicHelper.asText(singleType.data.title),
    singleType.data.items,
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, items) {
  return {
    scrollComponent: true,
    eyebrow: {
      text: title,
      size: "medium",
    },
    items: items.map((item) => ({
      heading: prismicHelper.asText(item.label),
      image: {
        alt: null,
        src: item.image.url,
      },
      description: prismicHelper.asText(item.content)
    }))
  };
  
}


