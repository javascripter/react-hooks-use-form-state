<div align="center">
<h1>useFormState()</h1>
<p>🎉 A simple and concise React Hook to handle form initial values that depend on dynamic data from SWR, React Query, and more.</p>
</div>

---

## 🚧 The Problem

When using data fetching libraries like useSWR() and useQuery(), setting the initial state of a form dynamically after data has been fetched can be challenging. If the fetched data is stale, the form state may not update correctly after revalidation.

## ✅ The Solution

`useFormState()` automatically handles updates to the initial value until the user starts editing the value.

```typescript
import { useFormState } from 'react-hooks-use-form-state'

const { data: product } = useSWR(`/products/${id}`)
const [name, setName] = useFormState(product?.name ?? '')

// 1. `name` variable will update itself whenever product name changes.
// 2. After `setName` is called, `name` will not react to initial value changes, preventing any loss of changes made manually.
```

## ✨ Features

- 🔄 Automatically updates the initial value until the user starts editing
- 💻 Supports TypeScript
- 🛠️ Functional state updater pattern
- 🔄 Provides a reset function to revert to the initial state

```typescript
import { useFormState } from 'react-hooks-use-form-state'

const [state, setState, resetState] = useFormState(dynamicData)
setState((prevState) => nextState)

// For example, you can clear state on modal open
const onModalOpen = { resetState() }
```

## 📦 Installation

```bash
yarn add react-hooks-use-form-state
```

or

```bash
npm install react-hooks-use-form-state
```

## 🔍 How It Works

The simplified version of the hook looks like this:

```typescript
function useFormState(initialValue) {
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

In addition to the above, useFormState() supports TypeScript, functional state
updater pattern, and a reset function to revert back to the initial state.
`useFormState()` also provides stable `setState` and `resetState` similar to React's
`setState()` hook.

## 📚 Related discussions

- [use SWR with a controlled form #561](https://github.com/vercel/swr/discussions/561)
- https://github.com/react-hook-form/react-hook-form/discussions/2282
