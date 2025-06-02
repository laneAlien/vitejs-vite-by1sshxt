import BookCard from '../../components/BookCard/BookCard';

const Catalog = () => {
  const books = [
    { id: 1, title: 'Книга 1', author: 'Автор 1' },
    { id: 2, title: 'Книга 2', author: 'Автор 2' },
  ];

  return (
    <div>
      <h1>Каталог книг</h1>
      {books.map((book) => (
        <BookCard key={book.id} title={book.title} author={book.author} />
      ))}
    </div>
  );
};

export default Catalog;