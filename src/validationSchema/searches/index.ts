import * as yup from 'yup';

export const searchValidationSchema = yup.object().shape({
  keyword: yup.string().required(),
  date: yup.date().required(),
  source_credibility: yup.number().integer().nullable(),
  region: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
});
