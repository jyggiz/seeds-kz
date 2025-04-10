const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../');

module.exports = async function writeContacts(lang) {
  const contacts = await client.getByUID('contacts', 'contacts', { lang: lang }); // 'page' — тип, 'home' — UID
  console.log(contacts);


  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c120-contacts/data/default${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  const data = getYaml(
    prismicHelper.asText(contacts.data.title),
    prismicHelper.asText(contacts.data.address),
    prismicHelper.asText(contacts.data.phone),
    prismicHelper.asText(contacts.data['phone-display']),
    prismicHelper.asText(contacts.data.email),
  )

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(title, address, tel, telToDisplay, email) {
  return {
    title: {
      element: 'h1',
      text: title,
      size: 'h5',
    },
    address: {
      copy: {
        content: address,
      },
    },
    tel: {
      copy: {
        content: `<a href="tel:${tel}">${telToDisplay}</a>`,
      },
    },
    email: {
      copy: {
        content: `<a href="mailto:${email}">${email}</a>`,
      },
    },
  };
}


