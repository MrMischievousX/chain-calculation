import { useCallback, useEffect, useState } from 'react';
import { DragSvg } from '../assets/svg';
import ConnectDot from './ConnectDot';
import { validateExpression } from '../utils';
import { useDebounce } from '../hooks/useDebounce';

interface Func {
  id: number;
  expression: string;
  nextId: number | null;
  position: { x: number; y: number };
}

interface props {
  func: Func;
  functions: Func[];
  handleExpressionChange: (id: number, exp: string) => void;
}

const FunctionCard = ({ func, functions, handleExpressionChange }: props) => {
  const { id, expression, nextId } = func;

  const [input, setInput] = useState(expression);

  const inputQuery = useDebounce(input, 500);

  const handleChange = useCallback(() => {
    if (!inputQuery || !validateExpression(inputQuery)) {
      setInput(expression);
    } else {
      handleExpressionChange(id, inputQuery);
    }
  }, [expression, id, inputQuery]);

  useEffect(() => {
    handleChange();
  }, [handleChange, inputQuery]);

  return (
    <div
      draggable
      className='w-[235px] h-[251px] bg-white flex flex-col justify-between items-start p-3 rounded-2xl border border-card_border shadow-[0px_0px_6px_0px_#0000000D] select-none'
    >
      <div className='flex w-full gap-2'>
        <img
          draggable={false}
          src={DragSvg}
          className='w-3 object-contain'
          alt='drag'
        />
        <div className='text-sm text-grey_text'>Function: {id}</div>
      </div>
      <div className=''>
        <label
          htmlFor={`${id}-value`}
          className='text-sm text-black font-medium'
        >
          Equation
        </label>
        <input
          className='border border-input_border w-full h-[33px] outline-none px-2 rounded-lg text-sm text-black font-medium mt-1'
          type='text'
          name=''
          id={`${id}-value`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className='w-full'>
        <label
          htmlFor={`${id}-nextId`}
          className='text-sm text-black font-medium'
        >
          Next Function
        </label>
        <select
          disabled
          className='block w-full outline-none h-[33px] border border-input_border px-2 rounded-lg mt-1 text-sm disabled:text-grey_text font-medium'
          value={nextId ?? ''}
          id={`${id}-nextId`}
        >
          <option value={''} hidden>
            -
          </option>
          {functions.map((funcOption) => {
            return (
              <option value={funcOption.id} key={`option-${funcOption.id}`}>
                Function: {funcOption.id}
              </option>
            );
          })}
        </select>
      </div>
      <div className='flex justify-between items-center w-full'>
        <div className='flex gap-1 items-center'>
          <ConnectDot id={`input-${id}`} />
          <div>input</div>
        </div>
        <div className='flex gap-1 items-center'>
          <div>output</div>
          <ConnectDot id={`output-${id}`} />
        </div>
      </div>
    </div>
  );
};

export default FunctionCard;
