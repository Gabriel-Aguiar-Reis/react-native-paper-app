import { ICostumer } from '@/lib/interfaces'

interface ICostumerContextProps {
  costumers: ICostumer[]
  addCostumer: (newCostumer: ICostumer) => void
  setCostumers: React.Dispatch<React.SetStateAction<ICostumer[]>>
}

export default ICostumerContextProps
