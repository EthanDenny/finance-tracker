import { useState } from 'react'

export const MoneyInput = ({ value, onChange }: {
  value: number
  onChange: Function
}) => {
  const [ empty, setEmpty ] = useState(false)

  return (
    <>
      <input
        className="input-text"
        value={ empty ? "" : "$" + value }
        onChange={ e => {
          const stripped = e.target.value.replace(/\D/g, "")
          
          if (stripped === "") {
            setEmpty(true)
            onChange(0)
          } else {
            setEmpty(false)
            onChange(Number(stripped))
          }
        } }
      />
    </>
  )
}
