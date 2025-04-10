const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeHero(lang) {
  const singleType = await client.getByUID('hero', 'hero', { lang: lang });
  console.log(singleType.data.items);


  const folderPath = path.join(projectRoot, 'src')
  
  const dataMain = getYaml(
    singleType,
    singleType.data['main-image'],
  )

  const dataNpa = getYaml(
    singleType,
    singleType.data['npa-image'],
  )

  const dataCompanies = getYaml(
    singleType,
    singleType.data['companies-image'],
  )

  const dataContacts = getYaml(
    singleType,
    singleType.data['contacts-image'],
  )

  const dataSeminars = getYaml(
    singleType,
    singleType.data['seminars-image'],
  )

  const dataForm = getYaml(
    singleType,
    singleType.data['form-image'],
  )

  writeFile(folderPath, dataMain, 'main', lang)
  writeFile(folderPath, dataNpa, 'npa', lang)
  writeFile(folderPath, dataCompanies, 'companies', lang)
  writeFile(folderPath, dataContacts, 'contacts', lang)
  writeFile(folderPath, dataSeminars, 'seminars', lang)
  writeFile(folderPath, dataForm, 'form', lang)
}

function writeFile(folderPath, data, prefix, lang) {
  fs.mkdirSync(folderPath, { recursive: true });

  const filePath = path.join(folderPath, `/app/component/block/c26-hero-banner/data/seeds-${prefix}${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(singleType, image) {
  return {
    scrollComponent: true,
    optimizeForLCP: true,
    earlyDisplay: true,
    fullHeight: true,
  
    align: {
      horizontal: "start",
      vertical: "bottom",
    },
  
    background: {
      image: {
        src: image.url,
        alt: "",
      },
    },
  
    content: {
      header: {
        heading: {
          element: "h1",
          size: "h4",
          text: prismicHelper.asText(singleType.data.title),
        },
        eyebrow: {
          size: "medium",
          text: prismicHelper.asText(singleType.data.eyebrow),
        },
      },
      buttonType: "pillar-short",
      buttons: [
        {
          icon: "wallet",
          title: prismicHelper.asText(singleType.data['join-title']),
          label: prismicHelper.asText(singleType.data['join-subtitle']),
          href: singleType.data['join-link'].url,
          transparent: true,
        },
        {
          icon: "clapper",
          title: prismicHelper.asText(singleType.data['contact-title']),
          label: prismicHelper.asText(singleType.data['contact-subtitle']),
          href: singleType.data['contact-link'].url,
          transparent: true,
        },
      ],
    },
  };
}


