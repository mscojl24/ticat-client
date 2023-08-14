//install library
import styled from 'styled-components';
//components
import CommentList from './CommentList';

interface Props {
  reviewId: number;
}

/** 2023/08/06- 댓글 캄포넌트 - by leekoby */
const Comment: React.FC<Props> = ({ reviewId }): JSX.Element => {
  return (
    <CommentSection>
      <CommentList reviewId={reviewId} />
    </CommentSection>
  );
};

export default Comment;
const CommentSection = styled.section`
  width: 100%;
  height: 100%;
  padding: 2rem 2rem;
`;
