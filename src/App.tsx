import { useCallback, useEffect, useRef, useState } from 'react';
import ConnectDot from './components/ConnectDot';
import FunctionCard from './components/FunctionCard';
import { calculateFunction, drawConnections } from './utils';
import cloneDeep from 'lodash.clonedeep'
import debounce from 'lodash.debounce'
import { Func } from './types';

function App() {
  const [initialValue, setInitialValue] = useState(0);
  const [result, setResult] = useState(0);
  const [functions, setFunctions] = useState<Func[]>([
    { id: 1, expression: 'x+2', nextId: 0, position: { x: 0, y: 0 } },
  ]);
  const svgRef = useRef(null);

  const debouncedAddNewFunction = useCallback(
    debounce(() => {
      const clonedFunction = cloneDeep(functions)
      const newFunction = { id: clonedFunction.length + 1, expression: 'x+2', nextId: -1, position: { x: 0, y: 0 } }
      clonedFunction.push(newFunction)
      setFunctions(clonedFunction)
    }, 200), [functions, setFunctions]
  );

  const calculateChain = useCallback(() => {
    let currentId: number = functions[0].id;
    let value = initialValue;

    if (!value) {
      return initialValue;
    }

    while (currentId) {
      const func = functions.find((f) => f.id === currentId);
      if (!func) break;

      if (func.nextId <= -1) return initialValue

      value = calculateFunction(value.toString(), func.expression);
      currentId = func.nextId;
    }

    return value;
  }, [functions, initialValue]);

  const handleExpressionChange = useCallback((id: number, newExpression: string) => {
    const indexToUpdate = functions.findIndex((fnc: Func) => fnc.id === id)

    if (functions[indexToUpdate].expression === newExpression) {
      return
    }

    const clonedFunction = cloneDeep(functions)
    clonedFunction[indexToUpdate].expression = newExpression

    setFunctions(clonedFunction);
  }, [functions])

  useEffect(() => {
    window.addEventListener('resize', () =>
      drawConnections(svgRef?.current, functions)
    );

    return window.removeEventListener('resize', () =>
      drawConnections(svgRef?.current, functions)
    );
  }, [functions]);

  useEffect(() => {
    drawConnections(svgRef?.current, functions);
  }, [functions]);

  useEffect(() => {
    const newResult = calculateChain();
    setResult(newResult);
  }, [initialValue, functions, calculateChain]);

  const updateNextId = (id: number, nextId: number) => {
    const clonedFunction = cloneDeep(functions)
    const indexToUpdate = clonedFunction.findIndex((fnc: Func) => fnc.id === id)
    clonedFunction[indexToUpdate] = { ...clonedFunction[indexToUpdate], nextId }
    setFunctions(clonedFunction)
  }

  return (
    <section className='min-w-screen min-h-screen bg-home bg-cover flex p-4 justify-between'>
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
            <ConnectDot id='start-0' />
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
            updateNextId={updateNextId}
          />
        ))}
      </div>

      <div className='max-w-[115px] flex justify-start items-center flex-col gap-2 mt-[171px]'>
        <p className='bg-success_label rounded-full text-white text-xs font-bold h-[22px] flex items-center w-full justify-center'>
          Final output y
        </p>
        <div className='h-[50px] w-full rounded-2xl border-2 border-final_output flex justify-evenly items-center overflow-hidden bg-white'>
          <div className='w-1/3 flex justify-center items-center h-full border-r border-r-success_label_light'>
            <ConnectDot id='end-0' />
          </div>
          <input
            disabled
            type='text'
            value={result}
            className='w-2/3 px-4 h-full decoration-transparent outline-none text-lg text-black font-bold text-right'
          />
        </div>
      </div>

      <button onClick={debouncedAddNewFunction} type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-base px-6 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 absolute">Create</button>

      <svg
        ref={svgRef}
        className='absolute top-0 right-0 w-full h-full pointer-events-none'
        xmlns='http://www.w3.org/2000/svg'
      />

    </section>
  );
}

export default App;
