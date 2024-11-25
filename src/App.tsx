import { useCallback, useEffect, useRef, useState } from "react";
import ConnectDot from "./components/ConnectDot";
import FunctionCard from "./components/FunctionCard";
import { calculateFunction, drawConnections } from "./utils";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import { Func } from "./types";

const fncLen = 1;
const createMe = Array(fncLen)
  .fill(0)
  .map(function (_, index) {
    return { id: index + 1, expression: "x+2", nextId: index !== fncLen - 1 ? index + 2 : 0, position: { x: 0, y: 0 } };
  });

function App() {
  const [initialValue, setInitialValue] = useState(0);
  const [result, setResult] = useState(0);
  const [functions, setFunctions] = useState<Func[]>(createMe);
  const svgRef = useRef(null);

  const debouncedAddNewFunction = useCallback(
    debounce(() => {
      const clonedFunction = cloneDeep(functions);
      const newFunction = { id: clonedFunction.length + 1, expression: "x+2", nextId: -1, position: { x: 0, y: 0 } };
      clonedFunction.push(newFunction);
      setFunctions(clonedFunction);
    }, 200),
    [functions, setFunctions]
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

      if (func.nextId <= -1) return initialValue;

      value = calculateFunction(value.toString(), func.expression);
      currentId = func.nextId;
    }

    return value;
  }, [functions, initialValue]);

  const handleExpressionChange = useCallback(
    (id: number, newExpression: string) => {
      const indexToUpdate = functions.findIndex((fnc: Func) => fnc.id === id);

      if (functions[indexToUpdate].expression === newExpression) {
        return;
      }

      const clonedFunction = cloneDeep(functions);
      clonedFunction[indexToUpdate].expression = newExpression;

      setFunctions(clonedFunction);
    },
    [functions]
  );

  useEffect(() => {
    const newRef = svgRef?.current;
    window.addEventListener("resize", () => drawConnections(newRef, functions));

    return () => {
      window.removeEventListener("resize", () => drawConnections(newRef, functions));
    };
  }, []);

  useEffect(() => {
    drawConnections(svgRef?.current, functions)
  }, [functions]);

  useEffect(() => {
    const newResult = calculateChain();
    setResult(newResult);
  }, [initialValue, functions, calculateChain]);

  const updateNextId = (id: number, nextId: number) => {
    const clonedFunction = cloneDeep(functions);
    const indexToUpdate = clonedFunction.findIndex((fnc: Func) => fnc.id === id);
    clonedFunction[indexToUpdate] = { ...clonedFunction[indexToUpdate], nextId };
    setFunctions(clonedFunction);
  };

  return (
    <main onLoad={() => {
      window.scrollTo(0, 0)
      drawConnections(svgRef?.current, functions)
    }} className='overflow-y-hidden lg:overflow-auto'>
      <section className='relative min-w-screen min-h-screen w-fit lg:w-screen bg-home bg-contain flex flex-col lg:flex-row p-4 justify-between items-start overflow-auto'>
        <div className='max-w-[115px] flex items-center flex-col gap-2 lg:h-screen justify-center'>
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

        <div className='flex lg:flex-wrap justify-center items-center lg:max-w-[80%] gap-8 md:gap-16'>
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

        <div className='max-w-[115px] flex items-center flex-col gap-2 lg:h-screen justify-center'>
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

        <svg
          ref={svgRef}
          className='absolute top-0 right-0 left-0 min-w-full w-full min-h-full h-full pointer-events-none'
          xmlns='http://www.w3.org/2000/svg'
        />
      </section>

      <button
        onClick={debouncedAddNewFunction}
        type='button'
        className='top-4 left-4 hidden lg:block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-base px-6 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 absolute'
      >
        Create
      </button>

      <div
        onClick={debouncedAddNewFunction}
        className='absolute top-4 right-4 bg-blue-700 hover:bg-blue-800 rounded-lg text-base px-2.5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 lg:hidden'
      >
        <svg width='24px' height='24px' viewBox='0 0 24 24' fill='none'>
          <circle cx='12' cy='12' r='10' stroke='#FFFFFF' strokeWidth='1.5' />
          <path
            d='M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15'
            stroke='#FFFFFF'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      </div>
    </main>
  );
}

export default App;
