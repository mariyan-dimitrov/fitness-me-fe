import styled from "styled-components/macro";
import "react-popper-tooltip/dist/styles.css";

import { usePopperTooltip } from "react-popper-tooltip";

const Tooltip = ({ children, tooltipText, className, placement = "top", trigger = "hover" }) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement,
      trigger,
    });

  return (
    <Wrap className={className}>
      <div ref={setTriggerRef}>{children}</div>

      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          {tooltipText}
        </div>
      )}
    </Wrap>
  );
};

export default Tooltip;

const Wrap = styled.div`
  .tooltip-container {
    --tooltipBackground: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    border: none;
  }

  .tooltip-arrow {
    &:before {
      display: none;
    }
  }
`;
