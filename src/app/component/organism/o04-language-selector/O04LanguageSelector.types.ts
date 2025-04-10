import { LinkProps } from '../../../data/interface/LinkProps';

export type O04LanguageSelectorProps = {
  languages: {
    activeLanguageCode: string;
    options: ReadonlyArray<O04LanguageSelectorItem>;
  };
  languageListId?: string;
  languageButtonLabel?: string;
};

interface O04LanguageSelectorItem extends LinkProps {
  languageCode: string;
  shortLabel?: string;
  label: string;
  href: string;
  title?: string; // name of language in current language, ex: label is 中文 - title is 'Chinese' if current language is EN
}
