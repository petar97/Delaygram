import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AddComment from './add-comment';
import { formatDistance } from 'date-fns';

export default function Comments({ docId, comments: allComments, posted, commentInput }) {
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  function handleNullName(displayName, name) {
    return displayName === null ? displayName=name : displayName;
  }

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item) => (
          <p key={`${item.comment}-${handleNullName(item.displayName, 'petar')}`} className="mb-1">
            <Link to={`/p/${handleNullName(item.displayName, 'petar')}`}>
              <span className="mr-1 font-bold">{handleNullName(item.displayName, 'petar')}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
          >
            View more comments
          </button>
        )}
        <p className="text-gray-base uppercase text-xs mt-2">
          {formatDistance(posted.toDate(), new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.object.isRequired,
  commentInput: PropTypes.object.isRequired
};