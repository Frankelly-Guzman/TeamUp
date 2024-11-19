import React from 'react';

const Comment = ({ comment, onRemove }) => (
  <div className="comment py-2 flex justify-between items-center">
    <p className="text-gray-700">{comment.body}</p>
    <button
      onClick={() => onRemove(comment.id)}
      className="text-red-500 ml-2"
    >
      ✖
    </button>
  </div>
);

export default Comment;