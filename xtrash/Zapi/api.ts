export const fetchBooks = async () => {
  const response = await fetch('/api/books');
  const data = await response.json();
  return data;
};