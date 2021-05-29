<div align="center">
<h1>useForm()</h1>
<p>The missing React Hook to handle form initial values that depend on dynamic data from SWR, React Query, and more</p>
</div>

---

## The Problem

You use a data fetching libraries like useSWR() and useQuery() and want to set initialState dynamically after some data has been fetched.

### Explanation

Suppose you have an index page and an edit page for some products.

When you navigate to an edit page from `/products` to `/products/:id/edit`, ideally you want to write code like this and call it a day.

```typescript
const opts = { suspense: true }

const { data: product } = useSWR(`/products/${id}`, opts)
const [name, setName] = useState(product.name)
// ...
```

However, the above code does NOT work properly.

If product name has changed and you have a stale cache, useSWR() will return _stale data_ on first render and your state will **not** be updated after revalidation.

Evne if you don't use suspense and split components into parent / child, you still have to handle the problem of staleness somehow. What to do?

### Related discussions of the problem

- [use SWR with a controlled form #561](https://github.com/vercel/swr/discussions/561)
- https://github.com/react-hook-form/react-hook-form/discussions/2282

## The Solution

Use `useForm()` to automatically handle updates to initialValue until user starts editing the value.

```typescript
const options = { suspense: true }
const { data: product } = useSWR(`/products/${id}`, options)
const [name, setState] = useForm(product.name)

// or even without suspense you can write almost exactly the same
const { data: product } = useSWR(`/products/${id}`)
const [name, setName] = useForm(product?.name ?? '')

// ...
```

## How does it work?

The simplified version of the hook is like this:

```typescript
function useForm(initialValue) {
  const [isChanged, setIsChanged] = useState(false)
  const [state, setState] = useState(undefined)
  return [
    isChanged ? state : initialValue,
    (state) => {
      setIsChanged(true)
      setState(state)
    },
  ]
}
```

In addition to the above, this library supports TypeScript, functional state updater pattern, and a reset function to revert back to `initialState`.

```typescript
import { useFormState } from 'react-hooks-use-form-state'
const [state, setState, reset] = useFormState(dynamicData)
setState((prevState) => nextValue)

// For example, you can clear state on modal open
const onModalOpen = { reset() }
```

## Installation

```
yarn add react-hooks-use-form-state

or

npm install react-hooks-use-form-state
```
