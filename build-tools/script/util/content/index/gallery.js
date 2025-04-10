const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeGallery(lang) {
  const singleType = await client.getByUID('gallery', 'gallery', { lang: lang });
  console.log(singleType.data.items);


  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c114-infographic/data/seeds.yaml`); // change as needed

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
    padding: {
      start: "regular",
      end: "regular",
    },
    heading: {
      element: "h2",
      size: "h4",
      text: title,
    },
    image: {
      src: "/image/c46-media-list/item1.jpg",
      alt: "",
    },
    lightbox: true,
    items: items.map((item) => ({
      variant: "landscape",
      image: {
        src: item.image.url,
      },
      lightbox: {
        image: {
          src: item.image.url,
        },
      },
      copy: "",
    })) 
  };
}


