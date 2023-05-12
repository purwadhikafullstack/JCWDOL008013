import * as yup from "yup";

export const propertyValidation = yup.object().shape({
  name: yup.string().required("Required"),
  address: yup.string().required("Required"),
  city: yup.number().required("Required"),
  picture: yup
    .mixed()
    .required("Required")
    .test(
      "fileFormat",
      "Unsupported format",
      (value) =>
        value &&
        ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(
          value.type
        )
    )
    .test(
      "is-valid-size",
      "Max allowed size is 1MB",
      (value) => value && value.size <= 1048576
    ),
  description: yup
    .string()
    .max(1000, "Description too long")
    .required("Required"),
  rules: yup.string().required("Required"),
});

export const roomValidation = yup.object().shape({
  name: yup.string().required("Required"),
  price: yup.number().positive().integer().required("Required"),
  description: yup.string().max(1000, "Description too long").required("Required"),
  picture: yup
    .mixed()
    .required("Required")
    .test(
      "fileFormat",
      "Unsupported format",
      (value) =>
        value &&
        ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(
          value.type
        )
    )
    .test(
      "is-valid-size",
      "Max allowed size is 1MB",
      (value) => value && value.size <= 1048576
    ),
});

export const profileValidation = yup.object().shape({
  username: yup.string().required("Required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Required"),
  gender: yup.string().required("Required"),
  birthdate: yup.string().required("Required"),
});

export const profilePictureValidation = yup.object().shape({
  picture: yup
    .mixed()
    .required("Required")
    .test(
      "fileFormat",
      "Unsupported format",
      (value) =>
        value &&
        ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(
          value.type
        )
    )
    .test(
      "is-valid-size",
      "Max allowed size is 1MB",
      (value) => value && value.size <= 1048576
    ),
});
