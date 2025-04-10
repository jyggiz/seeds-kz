const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../');

module.exports = async function writeHeader(lang) {
  const singleType = await client.getByUID('header', 'header', { lang: lang }); // 'page' — тип, 'home' — UID

  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/organism/o97-navigation-placeholder/navDataFallback${lang === 'ru' ? '' : '-kz'}.json`); // change as needed

  const data = getJSON(
    singleType.data.logo.url,
    singleType.data.links,
    prismicHelper.asText(singleType.data['join-title']),
    singleType.data['join-link'].url,
    singleType.data.langs,
    lang
  )

  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getJSON(logo, links, joinTitle, joinLink, langs, currentLang) {
  const currentLink = langs.find((lang) => prismicHelper.asText(lang.code) === currentLang)
  return {
    navigationContent: {
      scrollComponent: true,
      logo: {
        link: {
          href: currentLink ? currentLink.link.url : "/index.html",
          label: "NEOM.com homepage",
          target: null,
        },
        image: {
          src: logo,
          alt: "",
          variant: "contain",
        },
      },
      navigation: {
        mainAriaLabel: "",
        main: links.map((item) => ({
          label: prismicHelper.asText(item.label),
          href: item.link.url,
          target: item.link.target
        })),
        aside: [
          {
            type: "CTA",
            button: {
              label: joinTitle,
              size: "small",
              level: "primary",
              theme: "white",
              href: joinLink,
              target: "_blank",
            },
          },
        ],
      },
      isStickySearch: false,
      isDrawerNavigation: false,
      languages: {
        activeLanguageCode: currentLang,
        options: langs.map((item) => ({ 
          languageCode: prismicHelper.asText(item.code),
          shortLabel: prismicHelper.asText(item['short-label']),
          label: prismicHelper.asText(item.label),
          href: item.link.url,
         }))
      },
    },
  };
}



