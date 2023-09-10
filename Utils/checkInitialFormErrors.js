export function checkInitialFormErrors(formData, flag) {
  if (formData.username?.length < 2) {
    return 'Invalid Username';
  }

  if (!validateEmail(formData.email)) {
    return 'Invalid Email';
  }

  if (formData.password.length < 6 && flag == "login") {
    return 'Invalid Password';
  }

  if (formData.password.length < 6) {
    return 'Password must be atleast 6 characters';
  }

  return '';
}

const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
