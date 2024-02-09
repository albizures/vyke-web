export function joinFormData(...items: Array<FormData>) {
  const formData = new FormData();

  for (const data of items) {
    for (const [key, value] of data) {
      formData.append(key, value);
    }
  }

  return formData;
}
