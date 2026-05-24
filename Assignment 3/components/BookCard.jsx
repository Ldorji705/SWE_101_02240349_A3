import React from 'react';

const BookCard = ({ book, onPress }) => {
  return (
    <div className="book-card" onClick={() => onPress && onPress(book)}>
      <h3>{book.title}</h3>
      <p>{book.author}</p>
    </div>
  );
};

export default BookCard;
