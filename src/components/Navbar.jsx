const Navbar = () => {
  return (
    <header className="w-full h-[80px] flex justify-center items-center">
      <div className="wrapper size-fit relative flex justify-center items-center">
        <div className="circle ignielPelangi size-[30px] absolute flex justify-center items-center rounded-full bottom-[2.6rem] right-[9rem]">
          <p className="font-montserrat text-[10px] font-bold rotate-[15deg] text-default">
            24hr
          </p>
        </div>
        <h1 className="font-montserrat text-[55px] text-default text-center font-extrabold tracking-[4px]">
          STORY APP
        </h1>
      </div>
    </header>
  );
};

export default Navbar;
