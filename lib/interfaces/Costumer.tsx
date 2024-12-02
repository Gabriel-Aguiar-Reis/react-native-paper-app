interface ICostumer {
  id: string
  name: string
  locationData: {
    street: string
    number: number
    neighbourhood: string
    city: string
    CEP: number
  }
  contactData: {
    name: string
    phone: number
    isWhatsapp: boolean
  }
}

export default ICostumer
