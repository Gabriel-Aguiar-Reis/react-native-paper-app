interface ICostumer {
  id: string
  name: string
  locationData: {
    street: string
    number: number
    neighbourhood: string
    city: string
    CEP: string
  }
  contactData: {
    name: string
    phone: string
    isWhatsapp: boolean
  }
}

export default ICostumer
