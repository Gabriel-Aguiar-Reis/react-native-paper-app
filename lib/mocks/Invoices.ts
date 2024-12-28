import { IInvoice } from '@/lib/interfaces'
import { fakerPT_BR as faker } from '@faker-js/faker'

const generateProduct = (validityMonths: number): IInvoice['products'][0] => ({
  product: {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ max: 500 })),
    validityMonths,
    category: {
      id: faker.database.mongodbObjectId(),
      name: faker.commerce.productMaterial()
    }
  },
  quantity: faker.number.int({ min: 1, max: 5 })
})

const generateInvoice = (): IInvoice => {
  const visitDate = faker.date.past()
  const validityMonths = faker.number.int({ min: 6, max: 24, multipleOf: 6 })
  const numProducts = faker.number.int({ min: 1, max: 5 })
  const products = Array.from({ length: numProducts }, () =>
    generateProduct(validityMonths)
  )

  const returnDate = new Date(
    visitDate.getFullYear(),
    visitDate.getMonth() + validityMonths - 1,
    visitDate.getDate()
  )

  const totalValue = products.reduce(
    (acc, p) => acc + p.product.price * p.quantity,
    0
  )

  return {
    id: faker.database.mongodbObjectId(),
    costumer: {
      id: faker.database.mongodbObjectId(),
      name: faker.company.name(),
      locationData: {
        street: faker.location.street(),
        number: Number(faker.location.buildingNumber()),
        neighbourhood: faker.location.county(),
        city: faker.location.city(),
        CEP: faker.location.zipCode()
      },
      contactData: {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        isWhatsapp: faker.datatype.boolean()
      }
    },
    products,
    totalValue,
    visitDate,
    returnDate,
    realized: false
  }
}

const generateInvoices = (num: number): IInvoice[] =>
  Array.from({ length: num }, generateInvoice)

const numInvoices = faker.number.int({ max: 15 })
const mockInvoices = generateInvoices(numInvoices)

export default mockInvoices
