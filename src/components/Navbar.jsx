import { memo } from "react";

const Navbar = memo(() => {
  return (
    <header className="w-full h-20 flex justify-center items-center">
      <div className="wrapper size-fit relative flex justify-center items-center">
        <div className="circle ignielPelangi size-[30px] absolute flex justify-center items-center rounded-full bottom-[2.6rem] right-36">
          <p className="font-montserrat text-[10px] font-bold rotate-15 text-default">
            24hr
          </p>
        </div>
        <h1 className="font-montserrat text-[55px] text-default text-center font-extrabold tracking-[4px]">
          STORY APP
        </h1>
      </div>
    </header>
  );
});

export default Navbar;
