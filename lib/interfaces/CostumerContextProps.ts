import { IReadCostumerData } from '@/lib/interfaces'

interface ICostumerContextProps {
  costumers: IReadCostumerData[]
  addCostumer: (newCostumer: IReadCostumerData) => void
  setCostumers: React.Dispatch<React.SetStateAction<IReadCostumerData[]>>
  removeCostumer: (id: number) => void
  updateCostumer: (updatedCostumer: IReadCostumerData) => void
}

export default ICostumerContextProps
