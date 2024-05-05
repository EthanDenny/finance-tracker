import { createContext } from "react"

type DropdownContextType = {
    payees: string[]
    categories: string[]
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

export default DropdownContext
