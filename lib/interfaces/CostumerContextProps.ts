import { IReadCostumerData } from '@/lib/interfaces'

interface ICostumerContextProps {
  costumers: IReadCostumerData[]
  addCostumer: (newCostumer: IReadCostumerData) => void
  setCostumers: React.Dispatch<React.SetStateAction<IReadCostumerData[]>>
}

export default ICostumerContextProps
