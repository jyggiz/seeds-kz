const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeAbout(lang) {
  const singleType = await client.getByUID('about', 'about', { lang: lang });
  console.log(singleType);


  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c24-content/data/seeds-about${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  const data = getYaml(
    prismicHelper.asText(singleType.data.title),
    prismicHelper.asText(singleType.data.content),
    singleType.data.image.url
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, content, image) {
  return {
    scrollComponent: true,
    variant: "double-2-1",
    items: [
      {
        align: {
          horizontal: "start",
          vertical: "middle",
        },
        type: "paragraph",
        content: {
          heading: {
            size: "h4",
            text: title,
          },
          copy: {
            content: content,
          },
        },
      },
      {
        align: {
          horizontal: "start",
          vertical: "top",
        },
        type: "asset",
        content: {
          variant: "portrait",
          image: {
            src: image,
          },
        },
      },
    ],
  };
}


