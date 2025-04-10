const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeCompanies(lang) {
  const singleType = await client.getByUID('companies', 'companies', { lang: lang });
  console.log(singleType.data.items);


  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c46-media-list/data/seeds-company${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  const data = getYaml(
    prismicHelper.asText(singleType.data.title),
    prismicHelper.asText(singleType.data['filter-title']),
    singleType.data['filter-items'],
    singleType.data.companies,
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, filterTitle, filterItems, companies) {
  return {
    scrollComponent: true,
    filter: {
      title: {
        text: title,
        size: "h4",
      },
      secondary: {
        items: [
          {
            label: filterTitle,
            value: "location",
            items: filterItems.map((item) => ({
              label: prismicHelper.asText(item.label),
              value: prismicHelper.asText(item.value)
            }))
          },
        ],
      },
    },
    content: {
      items: companies.map((company) => ({
        heading: prismicHelper.asText(company.name),
        tag: prismicHelper.asText(company.tag),
        image: {
          src: company.image.url,
        },
        description: prismicHelper.asText(company.location),
      })) 
    },
  };
}