export const validateBook = (book = {}) => {
  const errors = {};
  if (!book.title) errors.title = 'Title is required';
  if (!book.author) errors.author = 'Author is required';
  return errors;
};

export default { validateBook };
