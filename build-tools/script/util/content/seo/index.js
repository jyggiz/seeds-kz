const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeSeo(lang) {
  const singleType = await client.getByUID('seo', 'seo', { lang: lang });
  console.log(singleType.data);

  const folderPath = path.join(projectRoot, 'src')

  const dataMain = getYaml(
    singleType.data['main-title'],
    singleType.data['main-description'],
  )

  const dataNpa = getYaml(
    singleType.data['npa-title'],
    singleType.data['npa-description'],
  )

  const dataCompanies = getYaml(
    singleType.data['companies-title'],
    singleType.data['companies-description'],
  )

  const dataContacts = getYaml(
    singleType.data['contacts-title'],
    singleType.data['contacts-description'],
  )

  const dataSeminars = getYaml(
    singleType.data['seminars-title'],
    singleType.data['seminars-description'],
  )

  const dataJoin = getYaml(
    singleType.data['join-title'],
    singleType.data['join-description'],
  )

  writeFile(folderPath, dataMain, 'index', lang)
  writeFile(folderPath, dataNpa, 'npa', lang)
  writeFile(folderPath, dataCompanies, 'companies', lang)
  writeFile(folderPath, dataContacts, 'contacts', lang)
  writeFile(folderPath, dataSeminars, 'gallery', lang)
  writeFile(folderPath, dataJoin, 'join', lang)
}

function writeFile(folderPath, data, prefix, lang) {
  fs.mkdirSync(folderPath, { recursive: true });

  const filePath = path.join(folderPath, `/app/data/yaml/seeds-${prefix}${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, description) {
  return {
    title: prismicHelper.asText(title),
    description: prismicHelper.asText(description)
  };
}