import * as React from 'react'

type SetState<S> = (value: S | ((prevState: S) => S)) => void
type FormState<T> =
  | {
      isChanged: false
    }
  | { isChanged: true; value: T }

function unwrap<T, A extends unknown[]>(valueOrFn: T | ((...args: A) => T), ...args: A) {
  return valueOrFn instanceof Function ? valueOrFn(...args) : valueOrFn
}

export function useFormState<S>(
  initialState: S | (() => S)
): [state: S, setState: SetState<S>, reset: () => void] {
  const unwrappedInitialState = unwrap(initialState)

  const [formState, setFormState] = React.useState<FormState<S>>({
    isChanged: false,
  })

  const setState: SetState<S> = React.useCallback(
    (value) => {
      setFormState((prevState) => {
        const newValue = unwrap(
          value,
          prevState.isChanged ? prevState.value : unwrappedInitialState
        )

        return {
          isChanged: true,
          value: newValue,
        }
      })
    },
    [unwrappedInitialState]
  )

  const reset = React.useCallback(() => {
    // This reverts state value and state value will be latest initialState
    setFormState({ isChanged: false })
  }, [])

  // Note we simply return initialState as state here if setState has not been called.
  // This is to avoid putting initialState inside useEffect dependencies because otherwise
  // useFormState(users.map(({id}) => id)) would cause an infinite loop.
  return [formState.isChanged ? formState.value : unwrappedInitialState, setState, reset]
}
