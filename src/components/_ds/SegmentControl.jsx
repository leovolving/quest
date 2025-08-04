import { useRef } from 'react';
import styled from 'styled-components';

const SegmentControlWrapper = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
`;

const SegmentButton = styled.button`
  flex: 1;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  color: ${({ selected, theme }) => (selected ? theme.colors.background : theme.colors.text)};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.primary : 'transparent')};
  border: none;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.colors.primaryHover : theme.cardHover};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
    z-index: 1;
  }
`;

export const SegmentControl = ({ options, selected, onChange }) => {
  const buttonRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    const total = options.length;
    let nextIndex = index;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = total - 1;
    }

    if (nextIndex !== index) {
      e.preventDefault();
      buttonRefs.current[nextIndex]?.focus();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(options[index]);
    }
  };

  return (
    <SegmentControlWrapper role="tablist" aria-label="Toggle view">
      {options.map((option, i) => (
        <SegmentButton
          key={option}
          role="tab"
          ref={(el) => (buttonRefs.current[i] = el)}
          id={`segment-${option}`}
          aria-selected={selected === option}
          aria-controls={`panel-${option}`}
          tabIndex={selected === option ? 0 : -1}
          selected={selected === option}
          onClick={() => onChange(option)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          {option}
        </SegmentButton>
      ))}
    </SegmentControlWrapper>
  );
};
