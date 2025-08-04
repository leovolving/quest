import { useMemo, useRef } from 'react';
import styled from 'styled-components';

import { Button, BUTTON_VARIANT } from '.';

const SegmentControlWrapper = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  width: fit-content;
`;

const SegmentButton = styled(Button)`
  flex: 1;
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  border-width: ${({ selected }) => (selected ? '2px' : '0')};
`;

export const SegmentControl = ({ options, selected, onChange, ariaLabeledBy }) => {
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
      onChange(options[index].value);
    }
  };

  const ariaProps = useMemo(() => {
    const result = {};
    if (ariaLabeledBy) result['aria-labeledby'] = ariaLabeledBy;
    else result['aria-label'] = 'Toggle view';
    return result;
  }, [ariaLabeledBy]);

  const isSelected = (value) => value === selected;

  return (
    <SegmentControlWrapper role="tablist" {...ariaProps}>
      {options.map(({ value, label }, i) => (
        <SegmentButton
          key={value}
          role="tab"
          ref={(el) => (buttonRefs.current[i] = el)}
          id={`segment-${value}`}
          aria-selected={isSelected(value)}
          aria-controls={`panel-${value}`}
          tabIndex={isSelected(value) ? 0 : -1}
          selected={isSelected(value)}
          onClick={() => onChange(value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          variant={isSelected(value) ? BUTTON_VARIANT.SECONDARY : BUTTON_VARIANT.TERTIARY}
        >
          {label}
        </SegmentButton>
      ))}
    </SegmentControlWrapper>
  );
};
