const ConnectDot = ({ id }: { id: string }) => {
  return (
    <div className='w-[15px] h-[15px] border-2 border-light_grey rounded-full flex items-center justify-center'>
      <div className='w-[6px] h-[6px] rounded-full bg-dot' id={id} />
    </div>
  );
};

export default ConnectDot;
