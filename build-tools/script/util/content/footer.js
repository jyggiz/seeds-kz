const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../');

module.exports = async function writeFooter(lang) {
  const singleType = await client.getByUID('footer', 'footer', { lang: lang }); // 'page' — тип, 'home' — UID

  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/s02-footer/data/seeds-index${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed
  const socialFilePath = path.join(folderPath, `/app/component/molecule/m12-social/data/seeds.yaml`);

  const data = getYaml(
    prismicHelper.asText(singleType.data['social-links-title']),
    prismicHelper.asText(singleType.data.copyright),
    singleType.data.links
  )

  const socialData = getSocialYaml(
    singleType.data.socials
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');

  const socialYamlStr = yaml.dump(socialData, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(socialFilePath, socialYamlStr, 'utf8');
}

function getYaml(socialTitle, copyright, links) {
  return {
    scrollComponent: true,
    social: {
      label: socialTitle,
      items: 'import!../../../molecule/m12-social/data/seeds.yaml',
    },
    marginalia: {
      items: links.map(({ label, link }) => ({ label: prismicHelper.asText(label), href: link.url, target: link.target })),
    },
    copyrightNotice: copyright,
  };
}

function getSocialYaml(socials) {
  return socials.map((social) => ({
    icon: prismicHelper.asText(social.icon),
    href: social.link.url,
    target: social.link.target,
  }))
}


