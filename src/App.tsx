import { useCallback, useEffect, useState } from 'react';
import ConnectDot from './components/ConnectDot';
import FunctionCard from './components/FunctionCard';
import { calculateFunction } from './utils';

function App() {
  const [initialValue, setInitialValue] = useState(0);
  const [result, setResult] = useState(0);
  const [functions, setFunctions] = useState([
    { id: 1, expression: 'x^2', nextId: 2, position: { x: 0, y: 0 } },
    { id: 2, expression: '2x+4', nextId: 4, position: { x: 0, y: 0 } },
    { id: 3, expression: 'x^2+20', nextId: null, position: { x: 0, y: 0 } },
    { id: 4, expression: 'x-2', nextId: 5, position: { x: 0, y: 0 } },
    { id: 5, expression: 'x/2', nextId: 3, position: { x: 0, y: 0 } },
  ]);

  const calculateChain = useCallback(() => {
    let currentId: number | null = 1;
    let value = initialValue;

    if (!value) {
      return initialValue;
    }

    while (currentId) {
      const func = functions.find((f) => f.id === currentId);
      if (!func) break;

      value = calculateFunction(value.toString(), func.expression);
      currentId = func.nextId;
    }

    return value;
  }, [functions, initialValue]);

  const handleExpressionChange = (id: number, newExpression: string) => {
    setFunctions(
      functions.map((f) =>
        f.id === id ? { ...f, expression: newExpression } : f
      )
    );
  };

  useEffect(() => {
    const newResult = calculateChain();
    setResult(newResult);
  }, [initialValue, functions, calculateChain]);

  return (
    <section className='min-w-screen min-h-screen bg-home bg-cover flex p-20 justify-between'>
      <div className='max-w-[115px] flex justify-start items-center flex-col gap-2 mt-[171px]'>
        <p className='bg-label rounded-full text-white text-xs font-bold h-[22px] flex items-center w-full justify-center'>
          Initial value of x
        </p>
        <div className='h-[50px] w-full rounded-2xl border-2 border-initial_input flex justify-evenly items-center overflow-hidden bg-white'>
          <input
            type='number'
            value={initialValue}
            onChange={(e) => {
              setInitialValue(Number(e.target.value));
            }}
            placeholder='0'
            className='w-2/3 px-4 h-full decoration-transparent outline-none text-lg text-black font-bold'
          />
          <div className='w-1/3 flex justify-center items-center h-full border-l border-l-label_light'>
            <ConnectDot id='input-start' />
          </div>
        </div>
      </div>

      <div className='relative flex flex-wrap justify-center items-center w-[80%] gap-32'>
        {functions.map((func) => (
          <FunctionCard
            func={func}
            key={func.id}
            functions={functions}
            handleExpressionChange={handleExpressionChange}
          />
        ))}
      </div>

      <div className='max-w-[115px] flex justify-start items-center flex-col gap-2 mt-[171px]'>
        <p className='bg-success_label rounded-full text-white text-xs font-bold h-[22px] flex items-center w-full justify-center'>
          Final output y
        </p>
        <div className='h-[50px] w-full rounded-2xl border-2 border-final_output flex justify-evenly items-center overflow-hidden bg-white'>
          <div className='w-1/3 flex justify-center items-center h-full border-r border-r-success_label_light'>
            <ConnectDot id='output-end' />
          </div>
          <input
            disabled
            type='number'
            value={result}
            className='w-2/3 px-4 h-full decoration-transparent outline-none text-lg text-black font-bold text-right'
          />
        </div>
      </div>
    </section>
  );
}

export default App;
