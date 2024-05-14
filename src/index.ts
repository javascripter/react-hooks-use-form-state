import React from 'react'

type FormState<S> =
  | {
      isChanged: false
    }
  | {
      isChanged: true
      value: S
    }
type FormAction<S> =
  | {
      type: 'SET_STATE'
      payload: S | ((prevState: S) => S)
    }
  | {
      type: 'RESET'
    }

function unwrap<T, A extends unknown[]>(valueOrFunction: T | ((...args: A) => T), ...args: A) {
  return typeof valueOrFunction === 'function'
    ? (valueOrFunction as (...args: A) => T)(...args)
    : valueOrFunction
}

/**
 * useFormState is a hook that allows you to use reactive initialState, similar to `values` prop
 * in React Hook Form. Useful when initialState needs to be updated by external values like server response.
 * The state can be reset to the latest initialValue when `reset` is called.
 *
 * Note: Unlike useState(), the initialState is not memoized and will be re-evaluated on every render.
 * It is recommended to wrap initialState in useMemo() or useCallback() if it needs to be stable or is expensive to compute.
 */
export function useFormState<S>(
  initialState: S | (() => S)
): [state: S, setState: React.Dispatch<React.SetStateAction<S>>, reset: () => void] {
  const initialStateValue = unwrap(initialState)

  const [state, dispatch] = React.useReducer<React.Reducer<FormState<S>, FormAction<S>>>(
    (state, action) => {
      switch (action.type) {
        case 'SET_STATE': {
          return {
            isChanged: true,
            value: unwrap(action.payload, state.isChanged ? state.value : initialStateValue),
          }
        }
        case 'RESET': {
          return { isChanged: false }
        }
      }
    },
    {
      isChanged: false,
    }
  )

  // setState function is stable despite the fact that we need to derive `prevState` from the latest initialState prop
  // in the functional updater pattern (setState(prevState => ...)).
  // Reducers can access latest props to calculate the next state so we do not have to add it to the dependency array.
  // This is how React implements useState() internally as well.
  // Learn more: https://overreacted.io/a-complete-guide-to-useeffect/#why-usereducer-is-the-cheat-mode-of-hooks
  const setState = React.useCallback(
    (value: React.SetStateAction<S>) => {
      dispatch({
        type: 'SET_STATE',
        payload: value,
      })
    },
    [dispatch]
  )

  const reset = React.useCallback(() => {
    dispatch({
      type: 'RESET',
    })
  }, [dispatch])

  // Note that it is important to directly return state.value here
  // instead of using useEffect() to synchronize state with initialState.
  // This is because initialState can be an unstable reference (e.g. object literal)
  // and putting initialState in the dependency array of useEffect() and setting the state
  // in the effect callback will cause an infinite loop.
  return [state.isChanged ? state.value : initialStateValue, setState, reset]
}
