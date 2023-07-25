import styled from 'styled-components';

// icons
import { AiOutlineLeft } from 'react-icons/ai';
import { AiOutlineRight } from 'react-icons/ai';

interface StampDateProps {
  year: number;
  month: number;
  onLastMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
}

/**  2023/07/24 - 스탬프 리스트 날짜 컴포넌트 - by sineTlsl */
const StampDate = ({ year, month, onLastMonth, onNextMonth, onCurrentMonth }: StampDateProps) => {
  return (
    <StampDateContainer>
      <button className="month-arrow" onClick={onLastMonth}>
        <AiOutlineLeft size="18px" color="#D3D3D3" />
      </button>
      <button className="current-date-btn" onClick={onCurrentMonth}>
        <p className="cal-month">
          {year}년 {month}월
        </p>
      </button>
      <button className="month-arrow" onClick={onNextMonth}>
        <AiOutlineRight size="18px" color="#D3D3D3" />
      </button>
    </StampDateContainer>
  );
};

export default StampDate;

const StampDateContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 2.5rem;
  justify-content: space-around;

  > button {
    border: none;
    background: none;
    cursor: pointer;
  }
  > .month-arrow {
    width: 20px;
  }
  > .current-date-btn {
    display: flex;
    width: calc;
  }
  > .current-date-btn > .cal-month {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-dark);
  }
`;
