import classNames from "classnames";
import React from "react";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <div className="flex w-full justify-center items-center">
      <div
        className={classNames(
          `flex lg:w-[30rem] xl:w-[32rem] sm:w-[30rem] md:w-[30rem] xs:w-[22rem] w-[20rem] mt-28 rounded-3xl  absolute flex-row items-center
       border-b-[1px] border-gray-200/10  pr-10 pl-10 p-3 bg-black/60 text-gray-200 justify-between`,
          className,
        )}
      >
        <a className="cursor-pointer" href="../">
          <div className="flex xs:text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-2xl">
            Safe<p className="font-semibold">Link</p>
          </div>
        </a>
        <div className="flex items-center gap-4 xs:text-sm sm:text-md md:text-lg lg:text-xl xl:text-xl decoration-gray-200/30">
          <a href="/video/" className="hover:scale-90 hover:transition-all hover:duration-150 hover:text-gray-300">
            Video
          </a>
          <span className="border-[1px] border-gray-100/20 h-[1rem] rounded-sm" />
          <a href="/music/" className="hover:scale-90 hover:transition-all hover:duration-150 hover:text-gray-300">
            Music
          </a>
        </div>
      </div>
    </div>
  );
}
