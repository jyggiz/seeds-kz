const prismic = require('@prismicio/client')
const prismicHelper = require('@prismicio/helpers')
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const repoName = "seeds-kz"; // замените на свой репозиторий
const endpoint = prismic.getRepositoryEndpoint(repoName);
const client = prismic.createClient(endpoint);

const projectRoot = path.resolve(__dirname, '../../../../../');

module.exports = async function writeForm(lang) {
  const singleType = await client.getByUID('form', 'form', { lang: lang });
  console.log(singleType.data.items);


  const folderPath = path.join(projectRoot, 'src')
  const filePath = path.join(folderPath, `/app/component/block/c48-forms/data/seed-join${lang === 'ru' ? '' : '-kz'}.yaml`); // change as needed

  const data = getYaml(singleType)

  fs.mkdirSync(folderPath, { recursive: true });

  // Convert JS object to YAML string
  const yamlStr = yaml.dump(data, { noRefs: true, indent: 2 });

  // Write the YAML file
  fs.writeFileSync(filePath, yamlStr, 'utf8');
}

function getYaml(singleType) {
  return {
    id: "form",
    action: "#",
    method: "post",
    form_id: "newsroom_contact_form",
    heading: {
      size: "h4",
      text: prismicHelper.asText(singleType.data.title),
    },
    messages: {
      success: prismicHelper.asText(singleType.data.success),
      error: prismicHelper.asText(singleType.data.error),
    },
    groups: [
      {
        items: [
          {
            type: "text",
            label: prismicHelper.asText(singleType.data['fullname-label']),
            name: "full-name",
            id: "full-name",
            placeholder: prismicHelper.asText(singleType.data['fullname-placeholder']),
            required: true,
            validate: {
              presence: {
                message: prismicHelper.asText(singleType.data['fullname-error']),
                allowEmpty: false,
              },
            },
          },
          {
            type: "phone",
            label: prismicHelper.asText(singleType.data['phone-label']),
            name: "Phone number",
            id: "phone-number",
            placeholder: prismicHelper.asText(singleType.data['phone-placeholder']),
            titleInEnglish: "Phone number",
            required: false,
            countryDropdown: {
              flagsPath: "image/flags/",
              placeholder: "Код",
              showRawValue: true,
              isWideDropdown: true,
              name: "COUNTRY",
              id: "country",
              titleInEnglish: "Country",
              items: [
                {
                  value: "+7",
                  label: "KZ",
                  countryCode: "KZ",
                },
              ],
            },
            validate: {
              numericality: {
                numericality: true,
                message: prismicHelper.asText(singleType.data['phone-error']),
              },
            },
          },
          {
            type: "select",
            label: prismicHelper.asText(singleType.data['region-label']),
            id: "region",
            placeholder: prismicHelper.asText(singleType.data['region-placeholder']),
            name: "region",
            titleInEnglish: "Регион",
            items: singleType.data.regions.map((region) => ({
              value: prismicHelper.asText(region['region-value']),
              label: prismicHelper.asText(region['region-name'])
            })),
            validate: {
              presence: {
                message: prismicHelper.asText(singleType.data['region-error']),
              },
            },
          },
          {
            type: "text",
            label: prismicHelper.asText(singleType.data['company-label']),
            name: "company",
            id: "company",
            placeholder: prismicHelper.asText(singleType.data['company-placeholder']),
            required: true,
            validate: {
              presence: {
                message: prismicHelper.asText(singleType.data['company-error']),
                allowEmpty: false,
              },
            },
          },
        ],
      },
    ],
    buttons: [
      {
        label: prismicHelper.asText(singleType.data.submit),
        size: "small",
        theme: "gold",
        type: "submit",
      },
    ],
  };
}