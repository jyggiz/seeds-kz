export enum Fields {
  CONTACT_PERMISSIONS = 'contact-permissions',
  EMAIL = 'email',
  FIRST_NAME = 'first-name',
  GLOBAL_HQ_LOCATION = 'global-hq-location',
  INTEREST = 'interest',
  LAST_NAME = 'last-name',
  LOCATION = 'location',
  CHOICE = 'category_interest', // trip - plan - businessType
  CHOICE_DESCRIPTION = 'category_interest_description',
}

export const optionalTextAreaEn = {
  type: 'textarea',
  label: 'Please specify',
  placeholder: 'Type here',
  maxlength: 254,
  required: true,
  id: 'category_interest_description',
  name: 'category_interest_description',
  validate: {
    presence: {
      message: '^Please enter the type of your business',
      allowEmpty: false,
    },
    length: { maximum: 254, tooLong: '^Description is too long' },
  },
};

export const optionalTextAreaAr = {
  type: 'textarea',
  label: 'يرجى التحديد',
  placeholder: 'أكتب هنا',
  maxlength: 254,
  required: true,
  id: 'category_interest_description',
  name: 'category_interest_description',
  validate: {
    presence: {
      message: '^الرجاء إدخال نوع عملك',
      allowEmpty: false,
    },
    length: { maximum: 254, tooLong: '^الوصف طويل جدًا' },
  },
};
