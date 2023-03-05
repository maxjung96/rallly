import { VoteType } from "@rallly/database";
import clsx from "clsx";
import * as React from "react";

import VoteIcon from "./vote-icon";
import {usePoll} from "@/components/poll-context";

export interface VoteSelectorProps {
  value?: VoteType;
  onChange?: (value: VoteType) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  className?: string;
  disabled: boolean;
}

const orderedVoteTypes: VoteType[] = ["yes", "ifNeedBe", "no"];
const orderedVoteTypesWithoutIfNeedBe: VoteType[] = ["yes", "no"];

const getNext = (value: VoteType, ifNeedBeEnabled: boolean) => {
  const voteTypes = ifNeedBeEnabled ? orderedVoteTypes : orderedVoteTypesWithoutIfNeedBe;
  return voteTypes[
    (voteTypes.indexOf(value) + 1) % voteTypes.length
  ];
};

export const VoteSelector = React.forwardRef<
  HTMLButtonElement,
  VoteSelectorProps
>(function VoteSelector(
  { value, onChange, onFocus, onBlur, onKeyDown, className , disabled},
  ref,
) {
  const { poll } = usePoll();
  return (
    <button
      data-testid="vote-selector"
      type="button"
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={clsx(
        "btn-default relative items-center justify-center overflow-hidden px-0",
        className,
      )}
      onClick={() => {
        onChange?.(value ? getNext(value, poll.ifNeedBeEnabled) : orderedVoteTypes[0]);
      }}
      ref={ref}
      disabled={disabled}
    >
      <VoteIcon type={value} />
    </button>
  );
});
