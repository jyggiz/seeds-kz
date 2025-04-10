const prismic = require('@prismicio/client')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../');

async function fetchContent() {
  const contactsRu = await client.getByUID('contacts', 'contacts', { lang: 'ru' }); // 'page' — тип, 'home' — UID
  console.log(contactsRu);

  const contactsKz = await client.getByUID('contacts', 'contacts', { lang: 'kz' }); // 'page' — тип, 'home' — UID
  console.log(contactsKz);


  const folderPath = path.join(projectRoot, 'src')
  const filePathRu = path.join(folderPath, '/app/component/block/c120-contacts/data/default.yaml'); // change as needed
  const filePathKz = path.join(folderPath, '/app/component/block/c120-contacts/data/default-kz.yaml'); // change as needed

  const data = {
    title: {
      element: 'h1',
      text: 'Контактная информация',
      size: 'h5',
    },
    address: {
      copy: {
        content: 'г. Астана, район Есиль, ул. Сығанақ, дом 64/1, н.п. 13',
      },
    },
    tel: {
      copy: {
        content: '<a href="tel:+77761235556">+7-776-123-55-56</a>',
      },
    },
    email: {
      copy: {
        content: '<a href="mailto:associationseeds@yandex.ru">associationseeds@yandex.ru</a>',
      },
    },
  };

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePathRu, yamlStr, 'utf8');
}


function writeContacts() {
  
}

fetchContent();