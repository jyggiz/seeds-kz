const writeContacts = require("./contacts");
const writeFooter = require("./footer");
const writeHeader = require("./header");
const writeAbout = require("./index/about");
const writeGoals = require("./index/goals");
const writeGallery = require("./index/gallery");
const writeCompany = require("./company/index");
const writeGalleryPage = require("./gallery/index");
const writeFiles1 = require("./npa/files-1");
const writeFiles2 = require("./npa/files-2");
const writeFiles3 = require("./npa/files-3");
const writeHero = require("./hero/index");
const writeForm = require("./form/index");
const writeCookiePolicy = require("./legal/cookie-policy");
const writePrivacyPolicy = require("./legal/privacy-policy");
const writeTermsOfUse = require("./legal/terms-of-use");
const writeSeo = require("./seo/index");

async function fetchContent() {
  //await writeContacts('ru')
  //await writeContacts('kz')
  //await writeFooter('ru')
  //await writeFooter('kz')
  //await writeHeader('ru')
  //await writeHeader('kz')
  //  await writeAbout('ru')
  //await writeAbout('kz')
  //await writeGoals('ru')
  //await writeGoals('kz')
  //await writeGallery('ru')
  //await writeCompany('ru')
  //await writeCompany('kz')
  //await writeGalleryPage('ru')
  //await writeGalleryPage('kz')
  //await writeFiles1('ru')
  //await writeFiles1('kz')
  //await writeFiles2('ru')
  //await writeFiles2('kz')
  //await writeFiles3('ru')
  //await writeFiles3('kz')
  //await writeHero('ru')
  //await writeHero('kz')
  //await writeForm('ru')
  //await writeForm('kz')
  //await writePrivacyPolicy('ru')
  //await writePrivacyPolicy('kz')
  //await writeCookiePolicy('ru')
  //await writeCookiePolicy('kz')
  //await writeTermsOfUse('ru')
  //await writeTermsOfUse('kz')
  await writeSeo('ru')
  await writeSeo('kz')
}

fetchContent();