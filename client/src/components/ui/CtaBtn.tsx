import type { ReactNode, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

const CtaBtn = ({ children, onClick, className, type }: Props) => {
  return (
    <button
      onClick={onClick}
      type={`${type || "button"}`}
      className={`bg-[#433cab] cursor-pointer px-4 rounded-xl hover:bg-[#3a3491] py-2 ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
};

export default CtaBtn;
